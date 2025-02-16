// src/utils/mediaQueries.ts

import { useMediaQuery, useTheme } from '@mui/material';
import { Breakpoint } from '@mui/material/styles';

// Define breakpoints
const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// Create hooks for each breakpoint
export const useIsXs = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.only('xs'));
};

export const useIsSm = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.only('sm'));
};

export const useIsMd = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.only('md'));
};

export const useIsLg = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.only('lg'));
};

export const useIsXl = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.only('xl'));
};

// Hooks for ranges
export const useIsSmDown = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

export const useIsMdDown = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};

export const useIsSmUp = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('sm'));
};

export const useIsMdUp = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('md'));
};

// Function to get current breakpoint
export const useCurrentBreakpoint = () => {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse() as Breakpoint[];
  return keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const matches = useMediaQuery(theme.breakpoints.up(key));
    return !output && matches ? key : output;
  }, null) as Breakpoint;
};


// CSS in JS media query strings
export const mediaQueries = {
  xs: `@media (max-width: ${breakpoints.sm - 1}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  md: `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  smDown: `@media (max-width: ${breakpoints.md - 1}px)`,
  mdDown: `@media (max-width: ${breakpoints.lg - 1}px)`,
  smUp: `@media (min-width: ${breakpoints.sm}px)`,
  mdUp: `@media (min-width: ${breakpoints.md}px)`,
};