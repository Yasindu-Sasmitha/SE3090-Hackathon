// Sri Lankan Districts and Provinces
export const SRI_LANKAN_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export const HAZARD_CATEGORIES = [
  { id: 'Road', name: 'Roads & Potholes', icon: '🚧', authority: 'Road Development Authority (RDA)' },
  { id: 'Light', name: 'Broken Streetlight', icon: '💡', authority: 'CEB / Local Municipal Council' },
  { id: 'Drain', name: 'Open Drain / Sewage', icon: '🌊', authority: 'Municipal Council / Pradeshiya Sabha' },
  { id: 'Tree', name: 'Fallen Tree / Branches', icon: '🌳', authority: 'Disaster Management Centre (DMC)' },
  { id: 'PublicArea', name: 'Unsafe Public Space', icon: '⚠️', authority: 'Sri Lanka Police & Local Council' },
  { id: 'Other', name: 'Other Infrastructure', icon: '🛠️', authority: 'Ministry of Local Government' }
];

export const EMERGENCY_NUMBERS = [
  { service: 'Sri Lanka Police Emergency', number: '119', badge: 'Police' },
  { service: 'Ambulance & Emergency Service', number: '1990', badge: 'Suwa Seriya' },
  { service: 'Fire & Rescue Service', number: '110', badge: 'Fire' },
  { service: 'Disaster Management Centre', number: '117', badge: 'Disaster' },
  { service: 'CEB Electricity Breakdown', number: '1987', badge: 'Power' },
  { service: 'National Child / Women Support', number: '1938', badge: 'Helpline' }
];

export const INITIAL_SAMPLE_REPORTS = [
  {
    title: 'Hazardous deep pothole near Pelawatta junction',
    category: 'Road',
    location: 'Battaramulla - Pelawatta Main Rd, Colombo',
    description: 'Deep unpaved depression causing severe traffic jams and near-accidents for motorcyclists at night. Water accumulates during rain.',
    severity: 'High',
    status: 'In Progress'
  },
  {
    title: 'Broken streetlights along Kandy Lake Round',
    category: 'Light',
    location: 'Sangharaja Mawatha, Kandy',
    description: 'At least 5 consecutive streetlights have been dead for 2 weeks, creating an unsafe dark walkway for pedestrians and university students.',
    severity: 'Medium',
    status: 'Reported'
  },
  {
    title: 'Uncovered storm drain near bus halt',
    category: 'Drain',
    location: 'Galle Road, Colombo 04 (Bambalapitiya)',
    description: 'Concrete slab broken and missing right in front of busy school bus halt. Major pedestrian hazard especially during sudden monsoon showers.',
    severity: 'High',
    status: 'Reported'
  },
  {
    title: 'Overhanging tree branches touching high voltage power lines',
    category: 'Tree',
    location: 'Kandy Road, Kelaniya',
    description: 'Heavy banyan branches swaying against power transmission lines with sparking observed during rainy evening.',
    severity: 'High',
    status: 'Resolved'
  },
  {
    title: 'Broken footbridge rail near railway crossing',
    category: 'PublicArea',
    location: 'Station Road, Galle Fort',
    description: 'Rusted safety barrier has detached, leaving narrow pedestrian footpath unprotected next to canal.',
    severity: 'Medium',
    status: 'In Progress'
  }
];
