import { jsPDF } from 'jspdf';

export function generateResumePDF(): void {
  // Create a letter-sized PDF in Portrait orientation with point measurements (pt)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageHeight = 792;
  const pageWidth = 612;
  const marginX = 54;
  let currentY = 54;
  const contentWidth = pageWidth - marginX * 2; // 504 pt

  // Colors
  const clrPrimary = '#1A1D20';    // Deep charcoal gray
  const clrSecondary = '#4A5056';  // Medium gray for descriptions
  const clrAccent = '#C85A32';     // Sienna/Orange for labels, years, highlights
  const clrLine = '#E2E8F0';       // Light gray partition dividers

  // Helper: Text rendering with strict font setups
  const drawText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontStyle: 'normal' | 'bold' | 'oblique' = 'normal',
    color = clrPrimary
  ) => {
    doc.setFont('Helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    doc.text(text, x, y);
  };

  // Helper: Bullet point with auto-wrapping
  const drawBulletPoint = (text: string, y: number, itemMarginLeft = 14): number => {
    // Draw sienna accent bullet dot
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(clrAccent);
    doc.text('▪', marginX + 4, y + 1);

    // Split text to width
    const bulletTextWidth = contentWidth - itemMarginLeft;
    const lines = doc.splitTextToSize(text, bulletTextWidth);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(clrSecondary);
    
    let localY = y;
    lines.forEach((line: string, index: number) => {
      doc.text(line, marginX + itemMarginLeft, localY);
      if (index < lines.length - 1) {
        localY += 13;
      }
    });

    return localY + 13; // Return ending Y plus padding for next item
  };

  // Helper: Draw Section headers
  const drawSectionHeader = (title: string) => {
    currentY += 18;
    // Draw tiny orange accent square
    doc.setFillColor(clrAccent);
    doc.rect(marginX, currentY - 9, 5, 5, 'F');

    // Title text
    drawText(title.toUpperCase(), marginX + 12, currentY - 4, 11, 'bold', clrPrimary);
    currentY += 4;

    // Divider line
    doc.setDrawColor(clrLine);
    doc.setLineWidth(1);
    doc.line(marginX, currentY, marginX + contentWidth, currentY);
    currentY += 15;
  };

  // --- HEADER SECTION ---
  doc.setProperties({
    title: 'Resume - Ethan Yang',
    subject: 'Ethan Yang Resume',
    author: 'Ethan Yang',
    creator: 'Ethan Yang Portfolio App'
  });

  // Main Display Name
  drawText('ETHAN YANG', marginX, currentY, 26, 'bold', clrPrimary);
  currentY += 14;

  // Personal Info / Subtitle
  drawText('Mathematical Physics Undergrad @ University of Waterloo', marginX, currentY, 10, 'normal', clrAccent);
  currentY += 16;

  // Contact line
  const contactText = 'e99yang@uwaterloo.ca  |  yangethan2006@gmail.com  |  Waterloo, ON, Canada  |  github.com/EthanYang1219';
  drawText(contactText, marginX, currentY, 8.5, 'normal', clrSecondary);
  currentY += 16;

  // Link to Portfolio
  drawText('Portfolio: ais-dev-wy3hfp3wvmkpecdpqthmyb-337291480977.us-east5.run.app', marginX, currentY, 8.5, 'normal', clrSecondary);
  currentY += 10;


  // --- EDUCATION ---
  drawSectionHeader('Education');

  // Institution line with timeframe and location
  drawText('University of Waterloo', marginX, currentY, 11, 'bold', clrPrimary);
  const timeEdu = 'Sept 2024 – Present';
  const rightAlignEduShift = contentWidth - doc.getTextWidth(timeEdu);
  drawText(timeEdu, marginX + rightAlignEduShift, currentY, 9.5, 'bold', clrAccent);
  currentY += 13;

  doc.setFont('Helvetica', 'oblique');
  doc.setFontSize(9.5);
  doc.setTextColor(clrSecondary);
  doc.text('Candidate for Bachelor of Science (B.Sc.) in Mathematical Physics (Honors) — Year 2', marginX, currentY);
  currentY += 15;

  // Key academic modules
  drawText('Selected University Curriculum modules:', marginX, currentY, 9, 'bold', clrPrimary);
  currentY += 12;

  const courses = [
    '• MATH 137/138 (Honors Calculus I & II): Limits, vector slopes, Taylor expansions, integration theory.',
    '• PHYS 121/122 (Honors Mechanics & EM): Newtonian physics, harmonic oscillators, Maxwell\'s vector profiles.',
    '• MATH 235 (Honors Linear Algebra): Eigenvalues, matrix factorization, vector transformations.',
    '• MATH 237 (Honors Calculus III): Vector calculus, lines/surfaces, Green\'s and Stokes\' theorems.',
    '• AMATH 250 (Honors Ordinary Differential Equations): Dynamical modeling, Laplace matrices, system loops.'
  ];

  courses.forEach(course => {
    drawText(course, marginX + 10, currentY, 8.5, 'normal', clrSecondary);
    currentY += 11;
  });
  currentY += 8;


  // --- TECHNICAL EXPERIENCE ---
  drawSectionHeader('Engineering & Academic Experience');

  const experienceItems = [
    {
      role: 'Formula Electric — Chassis & Carbon Fabrication Specialist',
      org: 'University of Waterloo (UWFE)',
      when: 'Sept 2025 – Present',
      bullets: [
        'Modeling, configuring, and fabricating safety-critical chassis structural components and composite layups (Carbon Fiber Reinforced Polymer, CFRP) for Waterloo\'s Formula SAE electric racing vehicle.',
        'Integrating comprehensive 3D finite element analyses (FEA) to calculate physical stiffness profiles, ensuring reliable composite tolerances across complex structural joints and suspension mounting arrays.',
        'Collaborating actively with multi-disciplinary sub-teams to streamline CAD packaging, weight optimization, and physical stress modeling in team machine-shops.'
      ]
    },
    {
      role: 'Robotics Control Systems Instructor & Coach',
      org: 'Western Pacific Robotics Academy',
      when: 'Sept 2023 – Present',
      bullets: [
        'Organizing and delivering technical curriculums to high-school youths, focusing on mechanical assembly layouts, structural stress ratios, and custom C++ modular firmware design.',
        'Instructing advanced control concepts including proportional-integral-derivative (PID) correction loops, digital encoder feedback systems, and dead-reckoning odometry models.',
        'Managing workshop assets and physical training spaces, expanding active regional tournament qualifiers and student enrollment by over 60%.'
      ]
    },
    {
      role: 'Team Captain & Mechanical Engineering Lead',
      org: 'VEX Robotics Elite Teams — 604X & 886W',
      when: 'Sept 2019 – May 2025',
      bullets: [
        'Directed end-to-end hardware development, chassis CAD modeling, structural fabrication, and autonomous routines across 6 consecutive competition seasons.',
        'Earned over 40 design, performance, and outstanding excellence accolades, including ranking as a 2020 VEX World Championship Division Semifinalist (top 6% globally).',
        'Synthesized digital engineering portfolios compiling mathematical control theory, acceleration loops, CAD specifications, and tournament post-mortem diagnostics.'
      ]
    }
  ];

  experienceItems.forEach(exp => {
    // Role title
    drawText(exp.role, marginX, currentY, 10, 'bold', clrPrimary);
    
    // Time on right
    const rightAlignShift = contentWidth - doc.getTextWidth(exp.when);
    drawText(exp.when, marginX + rightAlignShift, currentY, 9, 'bold', clrAccent);
    currentY += 12;

    // Org / Company
    drawText(exp.org, marginX, currentY, 9, 'bold', clrSecondary);
    currentY += 12;

    // Bullets
    exp.bullets.forEach(bullet => {
      currentY = drawBulletPoint(bullet, currentY);
    });
    currentY += 4;
  });


  // --- SKILLS & COMPETENCE ---
  drawSectionHeader('Skills & Core Competencies');

  const skillsBlock = [
    { label: 'Physics & Applied Math', list: 'Analytical Mechanics, Vector Calculus, Ordinary Differential Equations, Laplace Transforms, FEA' },
    { label: 'Design & Fabrication', list: 'CAD Modeling (Autodesk Fusion 360, Onshape, SolidWorks), composite CFRP wet layups, vacuum bagging' },
    { label: 'Programming & Web', list: 'C++, Python, TypeScript, React, Vite, Framer Motion, control-loop modeling, numerical simulations' },
    { label: 'Leadership & Methods', list: 'Agile team sprint cycles, STEM mentorship, peer review, digital design notebooks, competitive structures' }
  ];

  skillsBlock.forEach(skill => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(clrPrimary);
    doc.text(`${skill.label}: `, marginX, currentY);
    
    const labelWidth = doc.getTextWidth(`${skill.label}: `);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(clrSecondary);
    
    // Wrap competency list
    const remainingWidth = contentWidth - labelWidth;
    const skillLines = doc.splitTextToSize(skill.list, remainingWidth);
    
    skillLines.forEach((line: string, index: number) => {
      doc.text(line, marginX + labelWidth, currentY);
      if (index < skillLines.length - 1) {
        currentY += 11;
      }
    });
    currentY += 13;
  });

  // Save the PDF as downloadable file triggered in browser
  doc.save('Ethan_Yang_Resume.pdf');
}
