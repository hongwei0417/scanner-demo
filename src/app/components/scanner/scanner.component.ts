import { LoggerService } from './../../core/logger.service';
import { ScannerService } from '../../core/scanner.service';
import { DevicesComponent } from '../devices/devices.component';
import { CameraService } from '../../core/camera.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, merge, Subscription } from 'rxjs';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { BarcodeFormat } from '@zxing/browser';
import { DecoderService } from 'src/app/core/decoder.service';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  selector: 'scanner-component',
})
export class ScannerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  @ViewChild('scannerContainer') scannerContainer: ElementRef<HTMLDivElement>;
  @ViewChild('scannerArea') scannerArea: ElementRef<HTMLDivElement>;
  @ViewChild('scanResultCanvas')
  scanResultCanvas: ElementRef<HTMLCanvasElement>;

  @Output() onSelect = new EventEmitter<string>();
  @Output() onClose = new EventEmitter();

  availableDevices$: Observable<MediaDeviceInfo[]>;
  currentDevice$: Observable<MediaDeviceInfo>;
  controlOptions = [
    { name: 'Back', icon: 'pi pi-chevron-left' },
    // { name: 'Barcode', icon: 'pi pi-qrcode' },
    { name: 'Camera', icon: 'pi pi-camera' },
    { name: 'Stop', icon: 'pi pi-circle-on' },
  ];
  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.DATA_MATRIX,
  ];
  subscriptions: Subscription[] = [];
  isCameraActive$: Observable<boolean>;
  message: string;

  constructor(
    private router: Router,
    private cameraService: CameraService,
    private scannerService: ScannerService,
    private decoderService: DecoderService,
    private matBottomSheet: MatBottomSheet,
    private messageService: MessageService,
    private loggerService: LoggerService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.availableDevices$ =
      this.cameraService.availableDevices$.asObservable();
    this.currentDevice$ = this.cameraService.currentDevice$.asObservable();
    this.isCameraActive$ = this.cameraService.active$.asObservable();
    this.subscriptions.push(
      this.decoderService.result$.subscribe(this.showResult.bind(this))
    );
    this.isCameraActive$.subscribe(this.changeCameraActive.bind(this));
    this.subscriptions.push(
      this.loggerService.error$.subscribe((error) => {
        this.showErrorMessage(error);
      })
    );
  }

  ngAfterViewInit(): void {
    const canvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
    this.cameraService.init(this.video);
    this.scannerService.init(
      this.scannerArea,
      this.scannerContainer,
      this.scanResultCanvas,
      // this.snapshotCanvas,
      new ElementRef(canvas),
      null,
      null
    );
    this.decoderService.formats = this.formatsEnabled;
    this.subscriptions.push(
      this.availableDevices$.subscribe((devices) => {
        if (devices.length > 0) {
          const device = this.cameraService.currentDevice$.getValue();
          if (device?.deviceId) {
            this.onSelectDevice(device);
          } else {
            this.onSelectDevice(devices[0]);
          }
        }
      })
    );
    this.cameraService.loadDevices();
  }

  ngOnDestroy(): void {
    this.cameraService.close();
    this.scannerService.close();
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  openBottomSheet(): void {
    this.matBottomSheet.open(DevicesComponent, {
      data: {
        devices: this.cameraService.availableDevices$.getValue(),
        selectDevice: this.onSelectDevice.bind(this),
      },
    });
  }

  showResult(result: string) {
    this.messageService.add({
      severity: 'info',
      summary: result,
      sticky: true,
      // detail: 'Via MessageService',
    });
  }

  showErrorMessage(error: any) {
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'ERROR',
      sticky: true,
      detail: JSON.stringify(error),
    });
  }

  changeCameraActive(isActive: boolean) {
    this.controlOptions = this.controlOptions.map((item, i) => {
      if (i === 2) {
        return {
          name: isActive ? 'Stop' : 'Play',
          icon: isActive ? 'pi pi-circle-on' : 'pi pi-play',
        };
      }
      return item;
    });
  }

  // events
  onSelectDevice(device: MediaDeviceInfo) {
    this.cameraService.changeDevice(device);
  }

  onSelectControl(e: any) {
    switch (e.index) {
      case 0:
        this.onClose.emit();
        break;
      case 1:
        this.openBottomSheet();
        break;
      case 2:
        if (this.cameraService.active$.getValue()) {
          this.cameraService.stop();
        } else {
          this.cameraService.open();
        }
        break;
      default:
        break;
    }
  }

  onSelectResult(result: string) {
    this.onSelect.emit(result);
  }
}
