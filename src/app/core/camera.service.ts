import { filter } from 'rxjs/operators';
import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import adapter from 'webrtc-adapter';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  camera: ElementRef<HTMLVideoElement>;
  currentDevice$ = new BehaviorSubject<MediaDeviceInfo>(null);
  availableDevices$ = new BehaviorSubject<MediaDeviceInfo[]>([]);
  error$ = new BehaviorSubject<any>('');
  active$ = new BehaviorSubject<boolean>(false);
  videoLoaded$: Observable<Event>;
  constrains: any = { audio: false, video: true };
  stream: any;
  hasPermission: boolean;
  hasDevices: boolean;
  subscriptions: Subscription[] = [];

  constructor() {}

  get videoResolution() {
    return {
      width: { min: 1280, ideal: 1920, max: 1920 },
      height: { min: 720, ideal: 1080, max: 1080 },
    };
  }

  init(video: ElementRef<HTMLVideoElement>) {
    this.camera = video;
    const subscription = this.currentDevice$
      .pipe(filter(() => !!this.constrains?.video?.deviceId))
      .subscribe(this.loadStream.bind(this));
    this.subscriptions.push(subscription);
  }

  open() {
    this.loadStream();
  }

  stop() {
    if (!this.stream) return;
    this.stream.getTracks().forEach((track) => {
      track.stop();
      this.stream.removeTrack(track);
    });
    this.stream = null;
    this.camera.nativeElement.pause();
    this.camera.nativeElement.srcObject = null;
    this.active$.next(false);
  }

  close() {
    this.stop();
    this.constrains = { audio: false, video: true };
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  async getPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(this.constrains);
      stream.getTracks().forEach((track) => {
        track.stop();
        stream.removeTrack(track);
      });
      this.hasPermission = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  isPlaying(): boolean {
    const camera = this.camera.nativeElement;
    return !!(
      camera.currentTime > 0 &&
      !camera.paused &&
      !camera.ended &&
      camera.readyState &&
      camera.HAVE_CURRENT_DATA
    );
  }

  async loadStream() {
    try {
      this.stop();
      console.log(this.constrains);

      const stream = await navigator.mediaDevices.getUserMedia(this.constrains);
      this.hasPermission = true;

      if (this.currentDevice$.getValue() && !this.isPlaying()) {
        this.camera.nativeElement.srcObject = stream;
        this.camera.nativeElement.play();
        this.stream = stream;
        this.active$.next(true);
      }
      // this.loadDevices();
    } catch (error) {
      console.log(error);
      this.error$.next(error);
    }
  }

  async loadDevices() {
    const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
      (x) => x.kind === 'videoinput'
    );
    if (devices.length > 0) {
      this.hasDevices = true;
    }
    this.availableDevices$.next(devices);
  }

  changeDevice(device: MediaDeviceInfo) {
    if (!device) {
      this.stop();
      return;
    }
    const constrains = {
      audio: false,
      video: {
        deviceId: {
          exact: device.deviceId,
        },
        width: this.videoResolution.width,
        height: this.videoResolution.height,
      },
    };
    this.constrains = constrains;
    this.currentDevice$.next(device);
  }

  pauseAndPlay() {
    if (this.camera.nativeElement.paused) {
      this.camera.nativeElement.play();
    } else {
      this.camera.nativeElement.pause();
    }
  }
}
