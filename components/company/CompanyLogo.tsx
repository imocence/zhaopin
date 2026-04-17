'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const DEFAULT_LOGO = '/images/logos/default.svg';

export interface CompanyLogoProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const logoSrc = imageError || !src ? DEFAULT_LOGO : src;

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

export default CompanyLogo;
