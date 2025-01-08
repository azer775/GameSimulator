export interface NavItem {
  displayName?: string;
  divider?: boolean;
  iconName?: string;
  navCap?: string;
  route?: string;
  children?: NavItem[];
  expanded?: boolean;
}
