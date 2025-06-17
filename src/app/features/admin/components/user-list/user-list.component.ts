import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from 'src/app/core/services/admin.service';
import { UserModel } from 'src/app/core/models/user.model';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
    users: UserModel[] = [];
    loading = false;
    error: string | null = null;
    private destroy$ = new Subject<void>();

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.error = null;

        this.adminService.getAllUsers()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (users) => {
                    this.users = users;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading users:', err);
                    this.error = 'Failed to load users. Please try again.';
                    this.loading = false;
                }
            });
    }

    toggleAdminStatus(userId: string): void {
        this.loading = true;

        this.adminService.toggleAdminStatus(userId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedUser) => {
                    // Update user in the list
                    this.users = this.users.map(user => {
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
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
} 