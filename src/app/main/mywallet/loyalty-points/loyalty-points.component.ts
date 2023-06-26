import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
    selector: 'app-loyalty-points',
    templateUrl: './loyalty-points.component.html',
    styleUrls: ['./loyalty-points.component.scss']
})
export class LoyaltyPointsComponent implements OnInit {
    user = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)

    loyaltyPoints = [];
    loyalityPointList = [];
    isLoading: boolean = true;
    selectedBlock: any;
    loyaltyPointsLength: any;

    constructor(
        private _http: ApiServicesService,
    ) { }

    ngOnInit(): void {
        this.getLoyaltyPoints();
    }

    getLoyaltyPoints() {
        this._http.get(`my_loyalty_points?id=${this.user?.client}`)
            .subscribe(data => {
                this.isLoading = false;
                this.loyaltyPoints = data['result'];
                this.loyaltyPointsLength = data['result'].length;

            }, err => {
                this.isLoading = false;
            })
    }

    openLoyality(id, i) {
        this._http.get(`loyaltytransact?clientId=${this.user?.client}&locationId=${id}`)
            .subscribe((res: any) => {
                this.selectedBlock = i
                this.loyalityPointList = res.result
            }, err => { console.log(err) });
    }

    closeLoyality(id, i) {
        this.selectedBlock = null;
    }

    shopPointsTotal(e) {
        console.log(e);
        let points = 0;
        e.forEach(obj => {
            points += obj.have;
        });
        console.log(points);
        return points;
    }
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
}
