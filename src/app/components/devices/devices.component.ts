import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit {
  selectIndex: number;

  constructor(
    private matBottomSheetRef: MatBottomSheetRef<DevicesComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      devices: MediaDeviceInfo[];
      selectDevice: (device: MediaDeviceInfo) => void;
    }
  ) {}

  ngOnInit(): void {}

  select(device: MediaDeviceInfo, index: number): void {
    this.selectIndex = index;
    this.data.selectDevice(device);
    this.matBottomSheetRef.dismiss();
  }
}
