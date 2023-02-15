export interface Menu {
  code: string;
  text: string;
  order: number;
  icon: string;
  type: string;
  link: string;
  enable: boolean;
  module: string;
  displayed?: boolean;
  submenus: Menu[];
}
