import { ScannerService } from './../../core/scanner.service';
import { DevicesComponent } from './../../components/devices/devices.component';
import { CameraService } from './../../core/camera.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, merge } from 'rxjs';
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
})
export class ScannerComponent implements OnInit, AfterViewInit {
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  @ViewChild('scannerContainer') scannerContainer: ElementRef<HTMLDivElement>;
  @ViewChild('scannerArea') scannerArea: ElementRef<HTMLDivElement>;
  @ViewChild('scanResultCanvas')
  scanResultCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('snapshotCanvas') snapshotCanvas: ElementRef<HTMLCanvasElement>;

  availableDevices$: Observable<MediaDeviceInfo[]>;
  currentDevice$: Observable<MediaDeviceInfo>;
  controlOptions = [
    { name: 'Barcode', icon: 'pi pi-qrcode' },
    { name: 'Camera', icon: 'pi pi-camera' },
  ];
  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.DATA_MATRIX,
  ];

  constructor(
    private router: Router,
    private cameraService: CameraService,
    private scannerService: ScannerService,
    private decoderService: DecoderService,
    private matBottomSheet: MatBottomSheet,
    private messageService: MessageService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.availableDevices$ =
      this.cameraService.availableDevices$.asObservable();
    this.currentDevice$ = this.cameraService.currentDevice$.asObservable();
    this.decoderService.result$.subscribe(this.showResult.bind(this));
  }

  ngAfterViewInit(): void {
    this.currentDevice$.subscribe((device) => {
      if (device) {
        const canvas = this.renderer.createElement(
          'canvas'
        ) as HTMLCanvasElement;
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
      }
    });
    this.cameraService.loadDevices();
  }

  openBottomSheet(): void {
    this.matBottomSheet.open(DevicesComponent, {
      data: {
        devices: this.cameraService.availableDevices$.getValue(),
        selectDevice: this.selectDevice.bind(this),
      },
    });
  }

  selectDevice(device: MediaDeviceInfo) {
    this.cameraService.changeDevice(device);
  }

  selectControl(e: any) {
    switch (e.index) {
      case 0:
        break;
      case 1:
        this.openBottomSheet();
        break;
      default:
        break;
    }
  }

  showResult(result: string) {
    console.log(result);
    this.messageService.add({
      severity: 'success',
      summary: result,
      // detail: 'Via MessageService',
    });
  }
}
