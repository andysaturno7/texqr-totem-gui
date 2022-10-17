import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { AsistanceService } from 'src/app/services/asistance.service';
import { RegistrantsService } from 'src/app/services/registrants.service';
import { SocketService } from 'src/app/services/socket.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'main-client',
  templateUrl: './main-client.component.html',
  styleUrls: ['./main-client.component.css'],
})
export class MainClientComponent implements OnInit, OnDestroy {
  codeScanned: string | number | undefined;
  registrantData: any;
  runtimeRegistrantId: number | any;
  private subscVerified: Subscription | undefined;
  print: boolean;
  @ViewChild('loadSwal') public readonly loadSwal!: SwalComponent;
  @ViewChild('goinInSwal') public readonly goinInSwal!: SwalComponent;
  @ViewChild('goinOutSwal') public readonly goinOutSwal!: SwalComponent;
  @ViewChild('thanksInSwal') public readonly thanksInSwal!: SwalComponent;
  @ViewChild('errorSwal') public readonly errorSwal!: SwalComponent;

  loaderText: string = '';

  constructor(
    @Inject('API_CONF') private conf: any,
    public readonly swalTargets: SwalPortalTargets,
    private _ws: SocketService,
    private _state: StateService,
    private _registrants: RegistrantsService,
    private _asistance: AsistanceService
  ) {
    this.print = this.conf.print;
  }

  ngOnInit(): void {
    this.subscVerified = this.handleClientVerified();
  }

  ngOnDestroy(): void {
    this.subscVerified?.unsubscribe();
  }

  setScanState(active: boolean): void {
    this._state.setScanState(active);
  }

  async handleScanned(code: string | number) {
    this.setScanState(false);
    this.loaderText = 'Buscando el Registro...';
    this.loadSwal.fire();
    this.codeScanned = code;
    if (code == '') {
      this.errorSwal.text = 'Código vacío.';
      this.errorSwal.fire();
      return;
    }
    // this._ws.emit('client_scanned', code);
    // Promises
    try {
      let registrant = await this._registrants
        .getRegistrantByCode(code)
        .toPromise();
      console.log({ registrant });

      this.loaderText = 'Guardando Asistencia...';

      await this._asistance.addAsistance(registrant.id).toPromise();

      this.registrantData = registrant;
      this.loaderText = '';
      this.thanksInSwal.fire();
    } catch (error: any) {
      console.log({ error });

      this.errorSwal.title =
        error.error.message ||
        error.name ||
        error.message ||
        error.statusText ||
        error.error.name;

      this.errorSwal.fire();
    }
  }

  handleClientVerified(): Subscription {
    return this._ws.onClientVerified().subscribe(
      (res) => {
        if (res == null) {
          this.errorSwal.fire();
          return;
        }

        this.registrantData = res;
        this.thanksInSwal.fire();
      },
      (err) => {
        console.log('error: ' + err);
      }
    );
  }

  goinInDismiss(): void {
    this._state.setScanState(true);
  }

  goinInConfirm(): void {
    this._asistance.joinAsistance(this.registrantData.id).subscribe(
      (res: any) => {
        this.thanksInSwal.fire();
      },
      (err) => {
        this.errorSwal.fire();
      }
    );
  }

  goinOutDismiss(): void {
    this._state.setScanState(true);
  }

  goinOutConfirm(): void {
    this._asistance.leaveAsistance(this.registrantData.id).subscribe(
      (res: any) => {
        if (res[0] == 1) {
          this.thanksInSwal.fire();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  handlePrint(): void {
    this._registrants.print(this.registrantData);
    this.setScanState(true);
  }
}
