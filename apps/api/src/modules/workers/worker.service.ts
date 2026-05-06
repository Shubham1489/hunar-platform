/**
 * Worker Service — Profile management, skill handling, recommendations.
 */

import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { AppError } from '../../middleware/errorHandler';
import { ErrorCodes } from '@hunar/shared';
import crypto from 'crypto';

export class WorkerService {
  /** Get public worker profile by ID */
  static async getProfile(workerId: string) {
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      include: {
        user: { select: { id: true, name: true, phone: true, avatarUrl: true, createdAt: true } },
        skills: { include: { skill: true } },
      },
    });
    if (!worker) throw new AppError(ErrorCodes.NOT_FOUND, 'Worker not found', 404);
    return worker;
  }

  /** Update own worker profile */
  static async updateProfile(workerId: string, data: any) {
    // Update user name if provided
    if (data.name) {
      await prisma.user.update({ where: { id: workerId }, data: { name: data.name } });
    }

    const worker = await prisma.workerProfile.update({
      where: { id: workerId },
      data: {
        bio: data.bio,
        dailyRate: data.dailyRate,
        hourlyRate: data.hourlyRate,
        city: data.city,
        lat: data.lat,
        lng: data.lng,
        mode: data.mode,
        experienceYears: data.experienceYears,
      },
      include: {
        user: { select: { id: true, name: true, phone: true, avatarUrl: true } },
        skills: { include: { skill: true } },
      },
    });

    // Invalidate recommendation cache
    await redis.del(`rec:${workerId}:*`);

    return worker;
  }

  /** Add a skill by text — matches against taxonomy */
  static async addSkill(workerId: string, skillName: string, level: string, years: number) {
    // Fuzzy match against skill taxonomy
    const skill = await prisma.skill.findFirst({
      where: {
        OR: [
          { nameEn: { equals: skillName, mode: 'insensitive' } },
          { aliases: { has: skillName.toLowerCase() } },
        ],
      },
    });

    if (!skill) {
      // Create a new skill entry if not in taxonomy
      const newSkill = await prisma.skill.create({
        data: {
          nameEn: skillName,
          category: 'Other',
          aliases: [skillName.toLowerCase()],
        },
      });

      return prisma.workerSkill.create({
        data: {
          workerId,
          skillId: newSkill.id,
          level: level as any,
          years,
        },
        include: { skill: true },
      });
    }

    // Check if already added
    const existing = await prisma.workerSkill.findUnique({
      where: { workerId_skillId: { workerId, skillId: skill.id } },
    });
    if (existing) {
      throw new AppError(ErrorCodes.ALREADY_EXISTS, 'Skill already added', 409);
    }

    return prisma.workerSkill.create({
      data: {
        workerId,
        skillId: skill.id,
        level: level as any,
        years,
      },
      include: { skill: true },
    });
  }

  /** Remove a skill */
  static async removeSkill(workerId: string, skillId: string) {
    await prisma.workerSkill.deleteMany({
      where: { workerId, skillId },
    });
  }

  /** Toggle freelance availability */
  static async toggleAvailability(workerId: string, isAvailable: boolean) {
    return prisma.workerProfile.update({
      where: { id: workerId },
      data: { isAvailable },
    });
  }

  /** Get worker's job applications */
  static async getApplications(workerId: string, cursor?: string, limit = 20) {
    const applications = await prisma.jobApplication.findMany({
      where: { workerId },
      include: {
        job: {
          include: {
            employer: { select: { companyName: true, logoUrl: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = applications.length > limit;
    const data = hasMore ? applications.slice(0, limit) : applications;
    const nextCursor = hasMore ? data[data.length - 1]?.id : null;

    return { data, nextCursor, total: await prisma.jobApplication.count({ where: { workerId } }) };
  }

  /** Get worker's bookings */
  static async getBookings(workerId: string) {
    return prisma.booking.findMany({
      where: { workerId },
      include: {
        serviceRequest: true,
        customer: {
          include: { user: { select: { name: true, phone: true, avatarUrl: true } } },
        },
        rating: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Get earnings history */
  static async getEarnings(workerId: string) {
    const payments = await prisma.payment.findMany({
      where: { payeeId: workerId, status: { in: ['RELEASED', 'HELD'] } },
      orderBy: { createdAt: 'desc' },
    });

    const totalEarned = payments
      .filter(p => p.status === 'RELEASED')
      .reduce((sum, p) => sum + Number(p.amount) - Number(p.platformFee), 0);

    const pending = payments
      .filter(p => p.status === 'HELD')
      .reduce((sum, p) => sum + Number(p.amount) - Number(p.platformFee), 0);

    return { payments, totalEarned, pending };
  }

  /** Verify booking completion OTP */
  static async confirmOtp(workerId: string, bookingId: string, otp: string) {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, workerId, status: { in: ['CONFIRMED', 'IN_PROGRESS'] } },
    });

    if (!booking) {
      throw new AppError(ErrorCodes.NOT_FOUND, 'Active booking not found', 404);
    }

    if (!booking.otpCode) {
      throw new AppError(ErrorCodes.INVALID_BOOKING_OTP, 'No OTP generated for this booking', 400);
    }

    if (booking.otpExpiresAt && new Date() > booking.otpExpiresAt) {
      throw new AppError(ErrorCodes.BOOKING_OTP_EXPIRED, 'Booking OTP has expired', 400);
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashedOtp !== booking.otpCode) {
      throw new AppError(ErrorCodes.INVALID_BOOKING_OTP, 'Incorrect OTP', 400);
    }

    // Mark booking as completed
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        otpVerified: true,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Release payment
    await prisma.payment.updateMany({
      where: { bookingId, status: 'HELD' },
      data: { status: 'RELEASED' },
    });

    return { message: 'Job completed! Payment released.' };
  }

  /** Get AI recommendations (proxied from AI service) */
  static async getRecommendations(workerId: string) {
    // Check Redis cache
    const cacheKey = `rec:${workerId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Try AI service
    try {
      const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const response = await fetch(`${aiUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: workerId }),
      });

      if (response.ok) {
        const recommendations = await response.json();
        await redis.set(cacheKey, JSON.stringify(recommendations), 'EX', 3600);
        return recommendations;
      }
    } catch (err) {
      console.warn('AI service unavailable, falling back to basic recommendations');
    }

    // Fallback: basic skill-matched jobs
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      include: { skills: { include: { skill: true } } },
    });

    if (!worker) return [];

    const skillNames = worker.skills.map(ws => ws.skill.nameEn);
    const jobs = await prisma.jobPosting.findMany({
      where: {
        status: 'OPEN',
        ...(worker.city ? { city: worker.city } : {}),
      },
      include: {
        employer: { select: { companyName: true, logoUrl: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Basic skill matching
    const rankedJobs = jobs.map(job => {
      const requiredSkills = job.skillsRequired || [];
      const matchCount = requiredSkills.filter(s =>
        skillNames.some(ws => ws.toLowerCase() === s.toLowerCase()),
      ).length;
      const matchScore = requiredSkills.length > 0
        ? Math.round((matchCount / requiredSkills.length) * 100)
        : 50;
      return { ...job, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);

    await redis.set(cacheKey, JSON.stringify(rankedJobs), 'EX', 3600);
    return rankedJobs;
  }
}
