import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { NavItem } from './nav-item/nav-item';
import { navItems } from './sidebar-data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BrandingComponent, TablerIconsModule, MaterialModule,RouterLink],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor() { }
  //@Input() showToggle = true;
  //@Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Input() showToggle = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  navItems: NavItem[] = navItems;

  toggleDropdown(item: NavItem): void {
    item.expanded = !item.expanded;
  }

  ngOnInit(): void { }
}