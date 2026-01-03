import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { AdminService } from 'src/app/core/services/admin.service';
import { UserModel } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: UserModel[] = [];
  loading = false;
  error: string | null = null;
  page = 1;
  limit = 20;
  total = 0;
  private destroy$ = new Subject<void>();

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page = this.page): void {
    this.loading = true;
    this.error = null;

    this.adminService
      .getAllUsers(page, this.limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<UserModel[]>) => {
          this.users = response.body || [];
          const totalHeader = response.headers.get('X-Total-Count');
          const pageHeader = response.headers.get('X-Page');
          const limitHeader = response.headers.get('X-Limit');
          this.total = totalHeader ? Number(totalHeader) : this.users.length;
          this.page = pageHeader ? Number(pageHeader) : page;
          this.limit = limitHeader ? Number(limitHeader) : this.limit;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.error = 'Failed to load users. Please try again.';
          this.loading = false;
        },
      });
  }

  nextPage(): void {
    const maxPage = Math.ceil(this.total / this.limit) || 1;
    if (this.page < maxPage) {
      this.loadUsers(this.page + 1);
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.loadUsers(this.page - 1);
    }
  }

  toggleAdminStatus(userId: string): void {
    this.loading = true;

    this.adminService
      .toggleAdminStatus(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          // Update user in the list
          this.users = this.users.map((user) => {
            if (user._id === updatedUser._id) {
              return updatedUser;
            }
            return user;
          });
          this.loading = false;
        },
        error: (err) => {
          console.error('Error toggling admin status:', err);
          this.error = 'Failed to update user. Please try again.';
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
