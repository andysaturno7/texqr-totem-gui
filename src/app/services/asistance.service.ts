import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsistanceService {
  private asistanceData$: BehaviorSubject<any> = new BehaviorSubject(null);
  public asistanceData: Observable<any> = this.asistanceData$.asObservable();

  constructor(
    private http: HttpClient,
    @Inject('API_CONF') private conf: any
  ) {}

  getAsistance() {
    this.http
      .get(`${this.conf.uri}/projects/${this.conf.projectId}/asistance/count`)
      .subscribe(
        (res) => {
          this.setAsistance(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  setAsistance(newData: any) {
    this.asistanceData$.next(newData);
  }

  addAsistance(RegistrantId: number) {
    let RoomId = this.conf.roomId;
    return this.http.post(
      `${this.conf.uri}/projects/${this.conf.projectId}/asistance`,
      {
        RoomId,
        RegistrantId,
      }
    );
  }

  joinAsistance(id: number | string) {
    return this.http.post(
      `${this.conf.uri}/projects/${this.conf.projectId}/asistance/join`,
      { id }
    );
  }

  leaveAsistance(id: number | string) {
    return this.http.post(
      `${this.conf.uri}/projects/${this.conf.projectId}/asistance/leave`,
      { id }
    );
  }
}
