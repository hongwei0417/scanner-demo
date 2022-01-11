import { CameraService } from './../../core/camera.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private cameraService: CameraService) {}

  ngOnInit(): void {}

  async startScan(type: string) {
    const hasPermission = await this.cameraService.getPermission();

    if (hasPermission) {
      this.router.navigate(['scanner'], {
        state: {
          type,
        },
      });
    }
  }
}
