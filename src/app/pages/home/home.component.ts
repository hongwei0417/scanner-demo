import { ApiService } from './../../services/api.service';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { CameraService } from './../../core/camera.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ScannerLog } from 'src/app/models/ScannerLog';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private cameraService: CameraService,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {}

  form = this.formBuilder.group({
    shelf: ['', Validators.required],
    object: this.formBuilder.array([
      this.formBuilder.control('', Validators.required),
    ]),
  });
  currentScanner = null;
  autoSwitchField = true;
  showObjectBlock = false;
  showConfirmDialog = false;
  isCameraLoading = false;
  isFormValid = false;
  isSubmitLoading = false;
  subscription = new Subscription();

  get shelf(): FormControl {
    return this.form.controls['shelf'] as FormControl;
  }
  get object(): FormArray {
    return this.form.controls['object'] as FormArray;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.shelf.valueChanges.subscribe(this.checkShelfData.bind(this))
    );
    this.subscription.add(
      this.object.valueChanges.subscribe(this.checkObjectData.bind(this))
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

  checkShelfData(value: string) {
    if (value.length > 0) {
      this.showObjectBlock = true;
    } else {
      this.showObjectBlock = false;
      this.object.setValue(['']);
    }
    if (this.autoSwitchField) this.focusInput('input-0');
  }

  checkObjectData(value: string[]) {
    console.log(this.form.valid);
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
    this.object.push(new FormControl('', Validators.required));
  }

  onDeleteScanObject(index: number) {
    this.object.removeAt(index);
  }

  onCloseScanner(): void {
    this.clearScannerState();
  }

  onSelectResult(result: string) {
    switch (this.currentScanner.type) {
      case 'shelf':
        this.shelf.setValue(result);
        break;
      case 'object':
        const item = this.object.at(this.currentScanner.index) as FormControl;
        item.setValue(result);
        console.log(item);
        this.focusInput(`input-${this.currentScanner.index + 1}`);
        break;
      default:
        break;
    }
    this.clearScannerState();
  }

  onSubmit() {
    const data: ScannerLog = {
      shelfId: this.shelf.value,
      objectIds: this.object.value,
    };
    this.isSubmitLoading = true;
    this.apiService.log(data).subscribe({
      next: (data) => {
        console.log(data);
        this.isSubmitLoading = false;
        this.showConfirmDialog = true;
      },
      error: (error) => {
        console.log(error);
        this.isSubmitLoading = false;
        this.showConfirmDialog = true;
      },
    });
  }
}
