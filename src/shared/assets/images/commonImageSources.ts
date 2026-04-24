function createProfileDataUri() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="url(%23grad)"/><defs><linearGradient id="grad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#59D6F2"/><stop offset="1" stop-color="#5D6BFF"/></linearGradient></defs><circle cx="24" cy="18" r="7" fill="#F6FAFF"/><path d="M13 35.5C15.5 29.9 20.5 27 24 27C27.5 27 32.5 29.9 35 35.5" stroke="#F6FAFF" stroke-width="3" stroke-linecap="round"/></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const commonImageSources = {
  topbarProfile: {
    src: createProfileDataUri(),
    alt: '상단 프로필 이미지'
  }
} as const;
