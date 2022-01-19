import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { CameraService } from './../../core/camera.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private cameraService: CameraService) {}

  objectCodes = [''];
  currentScanner = null;
  autoSwitchField = true;
  showObjectBlock = false;
  showConfirmDialog = false;
  isCameraLoading = false;
  shelfCode = new FormControl();
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.shelfCode.valueChanges.subscribe(this.changeShelfCode.bind(this))
    );
  }

  clearScannerState(): void {
    this.currentScanner = null;
  }

  focusInput(id: string) {
    setTimeout(() => {
      const input = document.getElementById(id);
      if (input) input.focus();
    }, 0);
  }

  changeShelfCode(value: string) {
    if (value.length > 0) {
      this.showObjectBlock = true;
    } else {
      this.showObjectBlock = false;
      this.objectCodes = [''];
    }
    if (this.autoSwitchField) this.focusInput('input-0');
  }

  // events
  async onOpenScanner(type: string, index?: number) {
    this.isCameraLoading = true;
    const hasPermission = await this.cameraService.getPermission();

    if (hasPermission) {
      this.currentScanner = { type, index };
    }
    this.isCameraLoading = false;
  }

  onChangeObjectCode(e: any, index: number) {
    if (this.autoSwitchField) this.focusInput(`input-${index + 1}`);
  }

  onTrackObjects(index: number, item: string) {
    return index;
  }

  onAddScanObject() {
    this.objectCodes.push('');
  }

  onDeleteScanObject(index: number) {
    this.objectCodes.splice(index, 1);
  }

  onCloseScanner(): void {
    this.clearScannerState();
  }

  onSelectResult(result: string) {
    switch (this.currentScanner.type) {
      case 'shelf':
        this.shelfCode.setValue(result);
        break;
      case 'object':
        this.objectCodes[this.currentScanner.index] = result;
        this.focusInput(`input-${this.currentScanner.index + 1}`);
        break;
      default:
        break;
    }
    this.clearScannerState();
  }
}
