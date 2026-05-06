/**
 * Database Seed Script
 * Creates: skills taxonomy, sample users (worker, employer, customer, admin),
 * sample job postings, bookings, and ratings.
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

async function main() {
  console.log('🌱 Seeding Hunar database...\n');

  // ─── 1. Skill Taxonomy ─────────────────────────────

  const skillsData = [
    // Electrical
    { nameEn: 'Electrician', nameHi: 'इलेक्ट्रीशियन', category: 'Electrical', aliases: ['bijli', 'electrical'] },
    { nameEn: 'Wiring', nameHi: 'वायरिंग', category: 'Electrical', aliases: ['wire', 'wiring work'] },
    { nameEn: 'Smart Home', nameHi: 'स्मार्ट होम', category: 'Electrical', aliases: ['home automation'] },
    { nameEn: 'EV Charger', nameHi: 'ईवी चार्जर', category: 'Electrical', aliases: ['ev charging'] },
    { nameEn: 'Solar Panel', nameHi: 'सोलर पैनल', category: 'Electrical', aliases: ['solar'] },
    { nameEn: 'Circuit Board', nameHi: 'सर्किट बोर्ड', category: 'Electrical', aliases: ['circuit'] },
    // Plumbing
    { nameEn: 'Plumber', nameHi: 'प्लंबर', category: 'Plumbing', aliases: ['plumbing', 'nalkiwala'] },
    { nameEn: 'Pipe Fitting', nameHi: 'पाइप फिटिंग', category: 'Plumbing', aliases: ['pipe work'] },
    { nameEn: 'Leakage Repair', nameHi: 'लीकेज रिपेयर', category: 'Plumbing', aliases: ['leak fix'] },
    { nameEn: 'Bath Fittings', nameHi: 'बाथ फिटिंग', category: 'Plumbing', aliases: ['bathroom'] },
    // Carpentry
    { nameEn: 'Carpenter', nameHi: 'बढ़ई', category: 'Carpentry', aliases: ['badhai', 'wood work'] },
    { nameEn: 'Furniture', nameHi: 'फर्नीचर', category: 'Carpentry', aliases: ['furniture making'] },
    { nameEn: 'Cabinet Making', nameHi: 'कैबिनेट', category: 'Carpentry', aliases: ['cabinet', 'wardrobe'] },
    // Painting
    { nameEn: 'Painter', nameHi: 'पेंटर', category: 'Painting', aliases: ['painting', 'rang'] },
    { nameEn: 'Wall Painting', nameHi: 'दीवार पेंटिंग', category: 'Painting', aliases: ['wall paint'] },
    { nameEn: 'Waterproofing', nameHi: 'वॉटरप्रूफिंग', category: 'Painting', aliases: ['waterproof'] },
    // AC
    { nameEn: 'AC Technician', nameHi: 'एसी तकनीशियन', category: 'AC Repair', aliases: ['ac repair', 'ac service'] },
    { nameEn: 'Refrigerator Repair', nameHi: 'फ्रिज रिपेयर', category: 'AC Repair', aliases: ['fridge'] },
    // Others
    { nameEn: 'Mason', nameHi: 'मिस्त्री', category: 'Construction', aliases: ['mistri', 'rajgir'] },
    { nameEn: 'Tile Work', nameHi: 'टाइल वर्क', category: 'Construction', aliases: ['tiling'] },
    { nameEn: 'Welding', nameHi: 'वेल्डिंग', category: 'Construction', aliases: ['welder'] },
    { nameEn: 'Cook', nameHi: 'रसोइया', category: 'Cooking', aliases: ['chef', 'khana banana'] },
    { nameEn: 'Security Guard', nameHi: 'सुरक्षा गार्ड', category: 'Security', aliases: ['guard', 'chowkidar'] },
    { nameEn: 'Mechanic', nameHi: 'मैकेनिक', category: 'Automotive', aliases: ['car mechanic', 'gaadi'] },
    { nameEn: 'Delivery Driver', nameHi: 'डिलीवरी ड्राइवर', category: 'Delivery', aliases: ['driver', 'delivery'] },
    { nameEn: 'Deep Cleaning', nameHi: 'डीप क्लीनिंग', category: 'Cleaning', aliases: ['cleaning', 'safai'] },
    { nameEn: 'Maid', nameHi: 'घरेलू सहायिका', category: 'Housekeeping', aliases: ['kaamwali'] },
  ];

  const skills = [];
  for (const s of skillsData) {
    const skill = await prisma.skill.upsert({
      where: { nameEn: s.nameEn },
      update: {},
      create: s,
    });
    skills.push(skill);
  }
  console.log(`✅ Created ${skills.length} skills\n`);

  // ─── 2. Users ──────────────────────────────────────

  // Admin
  const admin = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999', name: 'Admin User', role: 'ADMIN',
      isVerified: true, isActive: true,
    },
  });
  console.log(`✅ Admin: ${admin.phone}`);

  // Worker — Ramesh Kumar
  const worker = await prisma.user.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      phone: '9876543210', name: 'Ramesh Kumar', role: 'WORKER',
      isVerified: true, isActive: true,
    },
  });
  const workerProfile = await prisma.workerProfile.upsert({
    where: { id: worker.id },
    update: {},
    create: {
      id: worker.id, mode: 'BOTH', experienceYears: 8,
      dailyRate: 900, hourlyRate: 150, city: 'Delhi',
      lat: 28.6139, lng: 77.2090, bio: 'Experienced master electrician with 8+ years in residential and commercial projects.',
      isAvailable: true, ratingAvg: 4.8, ratingCount: 42,
    },
  });

  // Assign skills to worker
  const electricianSkill = skills.find(s => s.nameEn === 'Electrician')!;
  const wiringSkill = skills.find(s => s.nameEn === 'Wiring')!;
  const smartHomeSkill = skills.find(s => s.nameEn === 'Smart Home')!;
  const evChargerSkill = skills.find(s => s.nameEn === 'EV Charger')!;

  for (const skill of [electricianSkill, wiringSkill, smartHomeSkill, evChargerSkill]) {
    await prisma.workerSkill.upsert({
      where: { workerId_skillId: { workerId: worker.id, skillId: skill.id } },
      update: {},
      create: {
        workerId: worker.id, skillId: skill.id,
        level: 'EXPERT', years: 8,
      },
    });
  }
  console.log(`✅ Worker: ${worker.name} (${worker.phone})`);

  // Employer — BuildCraft Infra
  const employer = await prisma.user.upsert({
    where: { phone: '9876543211' },
    update: {},
    create: {
      phone: '9876543211', name: 'Priya Sharma', role: 'EMPLOYER',
      isVerified: true, isActive: true,
    },
  });
  const employerProfile = await prisma.employerProfile.upsert({
    where: { id: employer.id },
    update: {},
    create: {
      id: employer.id, companyName: 'BuildCraft Infra',
      industry: 'Construction', city: 'Delhi',
      lat: 28.6500, lng: 77.2167,
      website: 'https://buildcraft.in',
    },
  });
  console.log(`✅ Employer: ${employer.name} (${employer.phone})`);

  // Customer — Aisha Patel
  const customer = await prisma.user.upsert({
    where: { phone: '9876543212' },
    update: {},
    create: {
      phone: '9876543212', name: 'Aisha Patel', role: 'CUSTOMER',
      isVerified: true, isActive: true,
    },
  });
  const customerProfile = await prisma.customerProfile.upsert({
    where: { id: customer.id },
    update: {},
    create: {
      id: customer.id, defaultCity: 'Bangalore',
      defaultLat: 12.9716, defaultLng: 77.5946,
    },
  });
  console.log(`✅ Customer: ${customer.name} (${customer.phone})`);

  // ─── 3. Job Postings ──────────────────────────────

  const jobs = [];
  const jobsData = [
    {
      title: 'Smart Home Wiring — 3BHK Apartment', description: 'Complete smart home wiring setup including Wi-Fi switches, automated lights, and EV charger point for a 3BHK apartment in Noida.',
      skillsRequired: ['Smart Home', 'Wiring', 'Electrician'], experienceMin: 3, salaryMin: 1000, salaryMax: 1500, salaryType: 'DAILY' as const, jobType: 'CONTRACT' as const,
      city: 'Noida', lat: 28.5355, lng: 77.3910, openings: 2,
    },
    {
      title: 'Commercial Electrical Work — Office Complex', description: 'Complete electrical setup for a new 5-floor commercial office building. Must be experienced with 3-phase wiring and fire safety compliance.',
      skillsRequired: ['Electrician', 'Circuit Board', 'Wiring'], experienceMin: 5, salaryMin: 800, salaryMax: 1200, salaryType: 'DAILY' as const, jobType: 'PERMANENT' as const,
      city: 'Delhi', lat: 28.6139, lng: 77.2090, openings: 3,
    },
    {
      title: 'Residential Plumbing — Housing Society', description: 'Plumbing repair and maintenance for a 50-unit housing society. Fix leakages, install new bath fittings, water tank maintenance.',
      skillsRequired: ['Plumber', 'Pipe Fitting', 'Leakage Repair'], experienceMin: 2, salaryMin: 600, salaryMax: 900, salaryType: 'DAILY' as const, jobType: 'CONTRACT' as const,
      city: 'Gurgaon', lat: 28.4595, lng: 77.0266, openings: 2,
    },
    {
      title: 'EV Charger Installation — Tech Park', description: 'Install 20 EV charger stations across a corporate tech park. Requires experience with EV infrastructure and safety standards.',
      skillsRequired: ['EV Charger', 'Electrician'], experienceMin: 3, salaryMin: 1200, salaryMax: 1800, salaryType: 'DAILY' as const, jobType: 'CONTRACT' as const,
      city: 'Bangalore', lat: 12.9716, lng: 77.5946, openings: 4,
    },
  ];

  for (const jd of jobsData) {
    const job = await prisma.jobPosting.create({
      data: { ...jd, employerId: employer.id },
    });
    jobs.push(job);
  }
  console.log(`✅ Created ${jobs.length} job postings\n`);

  // ─── 4. Job Application ───────────────────────────

  await prisma.jobApplication.create({
    data: {
      jobId: jobs[0].id, workerId: worker.id,
      status: 'SHORTLISTED', aiMatchScore: 95.2,
    },
  });
  console.log(`✅ Created sample job application\n`);

  // ─── 5. Service Request + Booking ─────────────────

  const serviceRequest = await prisma.serviceRequest.create({
    data: {
      customerId: customer.id, serviceType: 'AC Repair',
      description: 'AC not cooling properly, needs gas refill and general servicing.',
      city: 'Bangalore', lat: 12.9716, lng: 77.5946,
      status: 'BOOKED',
    },
  });

  const booking = await prisma.booking.create({
    data: {
      serviceRequestId: serviceRequest.id,
      customerId: customer.id, workerId: worker.id,
      status: 'COMPLETED', totalAmount: 800, platformFee: 80,
      otpVerified: true, confirmedAt: new Date(), completedAt: new Date(),
    },
  });

  // Payment
  await prisma.payment.create({
    data: {
      bookingId: booking.id, referenceType: 'BOOKING',
      referenceId: booking.id, payerId: customer.id, payeeId: worker.id,
      amount: 800, platformFee: 80, method: 'UPI', status: 'RELEASED',
    },
  });

  // Rating
  await prisma.rating.create({
    data: {
      bookingId: booking.id, raterId: customer.id, rateeId: worker.id,
      score: 5, review: 'Excellent work! Very professional and completed on time.',
    },
  });

  console.log(`✅ Created sample booking + payment + rating\n`);

  console.log('─────────────────────────────────');
  console.log('🎉 Seed completed successfully!');
  console.log('─────────────────────────────────');
  console.log('\n📱 Test accounts (use OTP: any 6-digit code in dev mode):');
  console.log(`   Admin:    9999999999`);
  console.log(`   Worker:   9876543210 (Ramesh Kumar)`);
  console.log(`   Employer: 9876543211 (Priya Sharma)`);
  console.log(`   Customer: 9876543212 (Aisha Patel)`);
  console.log('');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
