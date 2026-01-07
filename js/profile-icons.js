// Profile Icons - Default Avatar System

// 10 Premium gradient combinations for profile icons
export const PROFILE_ICONS = [
    {
        id: 1,
        name: 'Purple Dream',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#667eea'
    },
    {
        id: 2,
        name: 'Sunset',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: '#f093fb'
    },
    {
        id: 3,
        name: 'Ocean Blue',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: '#4facfe'
    },
    {
        id: 4,
        name: 'Green Mint',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        color: '#43e97b'
    },
    {
        id: 5,
        name: 'Orange Burst',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        color: '#fa709a'
    },
    {
        id: 6,
        name: 'Purple Pink',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        color: '#a8edea'
    },
    {
        id: 7,
        name: 'Deep Space',
        gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        color: '#30cfd0'
    },
    {
        id: 8,
        name: 'Peach',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        color: '#ff9a9e'
    },
    {
        id: 9,
        name: 'Cool Blues',
        gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        color: '#a1c4fd'
    },
    {
        id: 10,
        name: 'Amber Glow',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        color: '#ffecd2'
    }
];

// Get random icon (for new users)
export function getRandomIcon() {
    const randomIndex = Math.floor(Math.random() * PROFILE_ICONS.length);
    return PROFILE_ICONS[randomIndex].id;
}

// Get icon by ID
export function getIconById(id) {
    return PROFILE_ICONS.find(icon => icon.id === id) || PROFILE_ICONS[0];
}

// Get icon gradient
export function getIconGradient(iconId) {
    const icon = getIconById(iconId);
    return icon.gradient;
}

// Apply icon to element
export function applyIconToElement(element, iconId) {
    const icon = getIconById(iconId);
    if (element) {
        element.style.background = icon.gradient;
    }
}
