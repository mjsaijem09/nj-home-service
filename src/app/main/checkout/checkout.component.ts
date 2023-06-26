import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { filter } from 'lodash';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentSuccessPopupComponent } from './appointment-success-popup/appointment-success-popup.component';
import { PaymentSuccessPopupComponent } from './payment-success-popup/payment-success-popup.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  userData: any;
  newDate: any;
  isMobile: boolean = false;
  paymentType = 'payInStore';
  isPaid = false;

  moment: any = moment;

  payloadData: any;
  promoCode: string;
  giftVoucher: string;
  giftcard_voucher: any;
  voucherData: any;
  specialPrice: any = null;
  loyaltyPoints = 0;
  processingFee = 0;
  total_amount: any;
  tax: any;
  walletCredits: any;
  priceToDeductInWallet: any;

  payOnline: boolean;
  payWithGiftcard: boolean;
  payWithLoyaltyPoints: boolean;
  loyaltyPointsOnReview: boolean;
  shopCredits = false;
  bookingData: any;
  submitted: boolean = false;
  paymentDone: boolean = false;
  currency;
  constructor(
    private newToast: ToasterService,
    private httpService: ApiServicesService,
    private cookieService: CookieService,
    private router:Router,
    private authService:AuthServiceService,
    private bookingService: BookingService,
    public modalService:NgbModal,
  ) {}

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.userData = this.authService.getUserData();
    this.bookingData = this.bookingService.bookingData;
    this.getBookingDetails();
    this.loadWalletCredits();
    this.loadClientData();
    console.log(this.bookingData);
    this.wallet_checker();
  }
  loadClientData() {
    console.log(this.userData)
    this.httpService.get(`get_profile/${this.userData?.result?._id}`)
    .subscribe(res => {
      console.log(res);
    })
  }
  cardOutput(e) {
    let servicePrice = this.getServicePrice();
    if (this.voucherData != null) {
      this.getProcessingFee(this.specialPrice);
    } else {
      this.getProcessingFee(servicePrice);
    }
  }
  getProcessingFee(e) {
    this.httpService.get(`get_processing_fee?amount=${e}`)
    .subscribe(res => {
      this.processingFee = res.processingFee;
      this.totalPayment = res.total_amount;
    })
  }
  addProcessingFee() {
    let service = this.getServicePrice();
    let total = service + this.processingFee;
    return total.toFixed(2)
  }
  loadLoyaltyPoints(price) {
    this.httpService.get(`client/${this.userData?.client}`)
    .subscribe(res => {
      let data = res.result[0];
      data.loyaltyPoints.forEach(obj => {
        if(obj.locationId === this.bookingData.shop.locationId) {
          this.loyaltyPoints = obj.have;
        }
      });
      if (this.loyaltyPoints >= this.bookingData?.service?.loyaltyPointCanRedeem){
        this.paymentType = 'loyalty points';
      } else if (this.loyaltyPoints < price){
        this.newToast.error("Loyalty Points is not enough for checkout");
      }
    })
  }
  loadWalletCredits(price?) {
    this.httpService.get('my_wallet')
    .subscribe(res => {
      if (res['status'] == 200) {
        this.walletCredits = res['result'].walletBalance;
        console.log(this.walletCredits)
        if (price && this.walletCredits >= price){
          this.priceToDeductInWallet = price;
          this.paymentType = 'wallet';
        } else if (price && this.walletCredits < price){
          this.newToast.error("Wallet creadits is not enough for checkout");
        }
      } else {
        this.newToast.error("Something went wrong!");
      }
    })
  }

  getBookingDetails() {
    console.log(this.bookingData.shop);
    if(!this.bookingData || !this.bookingData.shop) {
      this.router.navigate(['/']);
    } else {
      this.currency = this.bookingData.shop.currency;
    }
    if(!this.bookingData.service) {
      this.router.navigate(['/service']);
    }
    if(!this.bookingData.therapist) {
      this.router.navigate(['/pick-therapist', this.bookingData.shop.locationId, this.bookingData.shop.ownerId]);
    }
    if(!this.bookingData.startTime) {
      this.router.navigate(['/select-time']);
    }
    if(!this.bookingData.bookFor) {
      this.router.navigate(['/book-for']);
    }
    this.loyaltyPointsOnReview = this.bookingData.shop.loyaltyPointsOnReview,

    this.loadShopDetails(this.bookingData.shop.locationId);
    this.initTotalPayment();
  }
  
  loadShopDetails(locationId) {
    this.httpService.get(`get_location/${locationId}`)
    .subscribe( res => {
      this.payOnline = res.result.onlineBookingRules.acceptOnlinePayment;
      this.payWithGiftcard = res.result.onlineGiftCard;
      this.payWithLoyaltyPoints = res.result.loyaltyPoints.active;
      console.log(
        "payOnline: ",this.payWithGiftcard, 
        "payOnline: ",this.payWithGiftcard, 
        "payWithLoyaltyPoints: ",this.payWithLoyaltyPoints,
        "loyaltyPointsOnReview: ",this.loyaltyPointsOnReview
        )
      console.log("SHOP DETAILS", res)
      console.log(this.bookingData)
      if (this.bookingData?.payOnlineLink) {
        this.handlePaymentType('card')
      }
    });
  }
  getServicePrice() {
    if (this.bookingData && this.bookingData.service) {
      if (this.bookingData.service.serviceSpecialPrice && this.bookingData.service.serviceSpecialPrice != null) {
        return this.bookingData.service.serviceSpecialPrice
      } else {
        return this.bookingData.service.servicePrice
      }
    }
  }

  handlePaymentType(type: string, e?) {
    e.preventDefault();
    this.paymentType = type;
    switch (type) {
      case 'payInStore':
        this.isPaid = false;
        this.paymentArray = [];
        this.initTotalPayment();
        break;
      case 'card':
        this.checkIfCustomerHasCard()
        let servicePrice = this.getServicePrice();
        if (this.payOnline) {
          this.paymentArray = [
            {
              amount: servicePrice,
              currency: this.currency.name.toLowerCase(),
              name: this.paymentType,
              transactionId: ''
            }
          ]
        }else{
          this.newToast.error("Online Payment is not available in this shop");
        }
        break;
      case 'gift card':
        if (this.payWithGiftcard) {
          this.processingFee = 0
        } else {
          this.newToast.error("Pay with Gifftcard Voucher is not available in this shop");
        }
        break;
      case 'loyalty points':
        if (this.payWithLoyaltyPoints) {
          this.processingFee = 0
          const price = this.getServicePrice();
          this.loadLoyaltyPoints(price);
          this.initTotalPayment();
        } else {
          this.newToast.error("Pay with Loyalty Points is not available in this shop");
        }
        break;
      case 'wallet':
        this.processingFee = 0
        const price = this.getServicePrice();
        this.loadWalletCredits(price);
        this.initTotalPayment();
        break;
    }
  }
  walletMethod: boolean;
  wallet_checker() {
    const amout = this.getServicePrice();
    this.httpService.get(`wallet_checker?ownerId=${this.bookingData?.shop?.ownerId}&amount=${amout}`)
    .subscribe(
      res => {
        if(res.status == 200) {
          this.walletMethod = true;
        } else {
          this.walletMethod = false;
        }
      },
      err => {
        this.walletMethod = false;
      }
    )
  }
  applyVoucher() {
    if(this.promoCode) {
      this.httpService.get(`find_discount_code?ownerId=${this.bookingData?.shop?.ownerId}&code=${this.promoCode}`)
      .subscribe(res => {
        console.log(res)
        if (res && res['status'] == 200 && res['result']) {
          if(res['result'].expiryDate && moment(res['result'].expiryDate).diff(moment(), 'days') < 0) {
            this.newToast.error('The promo code is expired!');
          } else {
            if (this.paymentType == 'loyalty points') {
              this.newToast.error(`The promo code not applicable to payment type 'Loyalty Points'`);
              return;
            }
            this.voucherData = res['result'];
            let price = this.bookingData?.service?.serviceSpecialPrice || this.bookingData?.service?.servicePrice;
            this.specialPrice = price;
            if(this.voucherData.valueType === 'percentage') {
              this.specialPrice = price - (price * (this.voucherData.value/ 100));

            } else if(this.voucherData.valueType === 'amount') {
              this.specialPrice = price >= this.voucherData.value ? price - this.voucherData.value : 0;

            }
            this.specialPrice = this.specialPrice % 1 != 0 ? this.specialPrice.toFixed(2) : this.specialPrice;
            if(this.paymentType === 'card') {
              this.getProcessingFee(this.specialPrice);
            }
            this.initTotalPayment();
          }
        }
      }, err => {
        if (err.body === "Not Exist") {
          this.newToast.error("Promo code not found.");
        } else {
          this.newToast.error(err.body);
        }
      })
    } else {
      this.newToast.error("Please insert a promo code.");
    }
  }
  totalPayment: Number;
  initTotalPayment() {
    let i = this.paymentType;
    let service_price = this.getServicePrice();
    switch (i) {
      case 'payInStore':
        if(this.specialPrice != null) {
          this.totalPayment = this.specialPrice;
        } else {
          this.totalPayment = service_price;
        }
        break;
      case 'card':
        if (this.voucherData != null) {
          this.getProcessingFee(this.specialPrice);
        } else {
          this.getProcessingFee(service_price);
        }
        break;
      case 'loyalty points':
        this.totalPayment = service_price;
        break;
      case 'wallet':
        if(this.specialPrice != null) {
          this.totalPayment = this.specialPrice;
        } else {
          this.totalPayment = service_price;
        }
        break;
    }
  }
  removePromoCode(){
    this.voucherData = null; 
    this.initTotalPayment();
  }
  paymentArray = [];
  applyGiftVoucher() {
    if(this.giftVoucher) {
      this.httpService.get(`applyvoucher?code=${this.giftVoucher}&shop_owner=${this.bookingData?.shop?.ownerId}&client=${this.userData?.client}`)
      .subscribe(res => {
        this.giftcard_voucher = res.voucher;
      }, err => {
        this.newToast.error(err.body);
      })
    }
  }
  giftcardVoucherLessAmount(lessAmount) {
    if (this.giftcard_voucher?.remainingAmount >= this.getServicePrice()) {
      this.paymentArray = [
        {
          amount: this.getServicePrice(),
          currency: this.currency.name.toLowerCase(),
          name: this.paymentType,
        }
      ]
      this.isPaid = true;
    } else {
      let servicePrice = this.getServicePrice();
      let difference = servicePrice - this.giftcard_voucher?.remainingAmount;
      this.getProcessingFee(difference);
      if (this.diffPaymentMethod === 'card') {
        this.paymentArray = [
          {
            amount: this.giftcard_voucher?.remainingAmount,
            currency: this.currency.name.toLowerCase(),
            name: this.paymentType,
          },
          {
            amount: difference,
            currency: this.currency.name.toLowerCase(),
            name: this.diffPaymentMethod,
          }
        ];
        this.isPaid = true;
      } if(this.diffPaymentMethod === 'payInStore') {
        this.paymentArray = [
          {
            amount: this.giftcard_voucher?.remainingAmount,
            currency: this.currency.name.toLowerCase(),
            name: this.paymentType,
          }
        ];
        this.isPaid = false;
      }
      this.modalService.open(lessAmount, { centered: true , size: 'sm'});
    }
  }
  hasDifference = false;
  diffPaymentMethod = null;
  differenceDetails = {}
  payDifferenceWith(e) {
    this.diffPaymentMethod = e;
    this.checkIfCustomerHasCard();
  }
  confirmDifference() {
    if(this.hasCard) {
      let servicePrice = this.getServicePrice();
      this.hasDifference = true;
      this.modalService.dismissAll();
      this.differenceDetails = {
        paymentType: this.diffPaymentMethod,
        amount: servicePrice - this.giftcard_voucher?.remainingAmount,
      }
    } else {
      this.newToast.error("Please add a card to proceed");
    }
  }
  to_be_paid_with_giftcard(){
    if(this.giftcard_voucher?.remainingAmount >= this.getServicePrice()) {
      return this.getServicePrice();
    } else {
      return this.giftcard_voucher?.remainingAmount;
    }
  }
  openAppointmentBookedSuccessModel() {
    this.modalService.open(AppointmentSuccessPopupComponent, { centered: true , size: 'sm'});
  }

  openPaymentSuccessModel(val) {
   const paymentSuccessRef = this.modalService.open(PaymentSuccessPopupComponent, { centered: true , size: 'md'});
   paymentSuccessRef.componentInstance.value = val;
  }
  hasCard = false;
  checkIfCustomerHasCard() {
    this.httpService.get(`add_customer_in_stripe`).subscribe(
      res => {
        console.log(res)
        let cards = res.result.sources.data
        if(cards.length >= 1) {
          this.hasCard = true;
          this.initTotalPayment();
        } else {
          this.newToast.error('Please add a card to proceed');
        }
      },
      err => {
        this.newToast.error('Please add a card to proceed');
      }
    );
  }
  bookAppointment(modal) {
    console.log(this.paymentType);
    if (this.paymentType === 'payInStore') {
      this.paymentArray = []
      this.postData()
    }
    if (this.paymentType === 'card' && this.hasCard) {
      if(this.hasCard) {
        this.postData();
      } else {
        this.newToast.error('Please add a card to proceed');
      }
    }
    if (this.paymentType === 'gift card') {
      let sevice_value = this.getServicePrice();
      if(this.giftcard_voucher){
        if(this.giftcard_voucher < sevice_value) {
          if(this.diffPaymentMethod != null && this.hasCard){
            this.postData()
          }else {
            this.giftcardVoucherLessAmount(modal)
          }
        } else {
          let servicePrice = this.getServicePrice();
          this.paymentArray = [
            {
              amount: servicePrice,
              currency: this.currency.name.toLowerCase(),
              name: this.paymentType,
            }
          ]
          this.postData();
        }
      } else {
        this.newToast.error('Please insert your giftcard Voucher');
      }
    }
    if (this.paymentType === 'loyalty points') {
      if(this.loyaltyPoints >= this.bookingData?.service?.loyaltyPointCanRedeem) {
        this.isPaid = true;
        this.payOnline = true;
        this.postData()
      } else {
        this.newToast.error('Loyalty Points is not enough to checkout this service'); 
      }
    }
    if (this.paymentType === 'wallet') {
      if(this.walletCredits >= this.getServicePrice()) {
        this.isPaid = true;
        this.payOnline = true;
        this.postData()
      } else {
        this.newToast.error('Wallet Credits is not enough to checkout this service');
      }
    }
  }
  postData() {
    this.submitted = true;
    const duration = this.bookingData?.service?.serviceTime;
    const trimstr = duration.replace(/\D+/g, '');
    if (trimstr.length >= 3) {
      var hour = trimstr.substring(-3, 1);
      var min = trimstr.substring(1);
    } else if (trimstr.length == 2) {
      hour = "0";
      min = trimstr;
    } else {
      hour = trimstr;
      min = "0";
    }
    
    let URL = 'appointment_book';
    let METHOD = 'post';
    let payload = [
      {
        bookedBy: {
          id: this.userData?.client,
          name: this.userData?.result?.firstName + ' ' + this.userData?.result?.lastName,
          type: 'client'
        },
        bookedFrom: 'PWA',
        client: this.bookingData?.bookFor?.clientId,
        day: this.bookingData?.startTime.split("T")[0]+'T00:00:00.000Z',
        duration: {
          hour: parseInt(hour),
          min: parseInt(min)
        },
        endTime: this.bookingData?.endTime,
        location: this.bookingData?.shop?.locationId,
        ownerId: this.bookingData?.shop?.ownerId,
        payment: this.paymentArray,
        price: this.bookingData?.service?.servicePrice,
        service: {
          id: this.bookingData?.service?.serviceId,
          loyaltyPointCanRedeem: this.bookingData?.service?.loyaltyPointCanRedeem,
          loyaltyPointRecieve: this.bookingData?.service?.loyaltyPointRecieve,
          name: this.bookingData?.service?.serviceName
        },
        service_pricing_name: this.bookingData?.service?.servicePricingName,
        special_price: this.bookingData?.service?.serviceSpecialPrice,
        staff: {
          firstName: this.bookingData?.therapist?.firstName,
          id: this.bookingData?.therapist?._id,
          lastName: this.bookingData?.therapist?.lastName,
          image: this.bookingData?.therapist?.image,
          gender: this.bookingData?.therapist?.gender
        },
        startTime: this.bookingData?.startTime,
        requested_staff: this.bookingData?.therapist?.requested_staff,
        walkIn: false,
        notes: this.bookingData?.notes,
        appointment_paid_online: this.isPaid,
        isPaid: this.isPaid
      }
    ];

    if (this.cookieService.get("marketingDiscountLink")) {
      payload[0]['marketingDiscountLink'] = this.cookieService.get("marketingDiscountLink");
      URL = "discounted_book";
    }

    if(this.voucherData) {
      const { value, valueType, promotionalCode} = this.voucherData;
      payload[0]['discount'] = value;
      payload[0]['discountType'] = valueType;
      payload[0]['promotional_code'] = promotionalCode;
    }

    if (this.paymentType == 'loyalty points'){
      let payment = {
        name: 'loyalty points',
        amount: this.getServicePrice()
      }
      payload[0].payment = [payment];
    }

    if (this.paymentType == 'wallet'){
      let payment = {
        name: 'wallet',
        amount: this.getServicePrice()
      }
      payload[0].payment = [payment];
    }
    if (this.paymentType === 'gift card') {
      payload[0].notes += `<br> Appointment is paid with giftcard voucher(${this.giftVoucher})`
    }
    this.payloadData = payload;
    if(this.bookingData.editAppointment) {
      URL = `update_appointment/${this.bookingData.editAppointment.appointmentId}`;
      METHOD = 'put';
      this.payloadData = payload[0];
      this.payloadData['_id'] = this.bookingData.editAppointment.appointmentId;
    }

    if (this.bookingData.payOnlineLink) {
      URL = `update_appointment/${this.bookingData.appointmentId}`;
      METHOD = 'put';
      this.payloadData[0].appointment_paid_online = true;
      this.payloadData[0].isPaid = true;
      this.paymentArray = [
        {
          amount: this.getServicePrice(),
          currency: this.currency.name.toLowerCase(),
          name: 'card',
          transactionId: ''
        }
      ]
      this.payloadData[0].payment = [this.paymentArray];
      this.payloadData[0]._id = this.bookingData.appointmentId;
    }
    console.log("PAYLOAD: ",this.payloadData)
    this.httpService[METHOD](URL, this.payloadData)
      .pipe(distinctUntilChanged())
      .subscribe(
        res => {
      if(res && res.status == 200) {
        let bookingRef = res.result[0].booking_reference;
        let appointmentId = res.result[0]._id;
        let aptData = res.result[0];
        if (this.paymentType == 'card') {
          this.stripe_checkout(aptData);
        }
        if (this.diffPaymentMethod == 'card') {
          this.stripe_checkout(aptData);
        }
        if (this.paymentType == 'gift card') {
          let body = {
            giftCardId: this.giftcard_voucher._id,
            clientId: this.userData?.client,
            amount: Number,
          };
          if (this.giftcard_voucher?.remainingAmount >= this.getServicePrice()) {
            body.amount = this.getServicePrice();
            this.isPaid = true;
          } else {
            body.amount = this.giftcard_voucher?.remainingAmount;
          }
          this.httpService.post(`update_giftcard`, body)
            .subscribe(res => {
              if (res['status'] == 200) {
                console.log(res);
              } else {
                this.newToast.error(res['message']);
                console.log(res);
              }
            });
          this.update_appointment(aptData);
        };
        if (this.paymentType == 'loyalty points'){
          this.update_appointment(aptData);
        }
        if (this.paymentType == 'wallet') {
          this.wallet_checkhout(aptData);
        }
        if (res.discountStatus) {
          if (res.discountStatus === "DISCOUNT_APPLIED") {
            // Things to do when discount is validated sucessfully
            this.cookieService.delete("marketingDiscountLink");
            this.newToast.success("Your discount will be applied on checkout.");
          } else if (res.discountStatus === "DISCOUNT_NOT_APPLIED") {
            // Things to do when discount is invalid
            // This typically happens if discount cookie is present but
            // customer books for a different location, or the currently logged in user
            // is not the customer intended for discount link

            // In here, we can just hide that the discount failed
            // but log it for debugging purposes
            console.log("Discount cookie not applied, not deleting");
          }
        }
      }
      
      // this.notifyCustomer(res.result[0].Id)

      // console.log(URL);
      if (this.bookingData.editAppointment) {
        this.rescheduleNotification(res.result[0].Id);
      } else {
        this.confirmationNotification(res.result[0].Id);
      }
      if (this.paymentType === 'payInStore') {
        this.router.navigate(['/schedule']);
      }
    }, err => {
      this.submitted = false;
      console.log(err);
      this.newToast.error(err.body);
    });
  }
  stripe_checkout(aptData) {
    let Body = {
      "amount": this.totalPayment,
      "processingFee": this.processingFee,
      "currency": this.currency.name.toLowerCase(),
      "description": "Appointment created from BookUs Web App",
      "appointmentId": aptData._id,
      "metadata": {
        "clientName": `${this.userData?.result?.firstName} ${this.userData?.result?.lastName ? this.userData?.result?.lastName : ''}`,
        "therapist": `${this.bookingData?.therapist?.firstName}`,
        "bookedFrom": "PWA",
        "startTime": `${this.bookingData?.startTime}`,
        "endTime": `${this.bookingData?.endTime}`,
        "service_pricing_name": `${this.bookingData?.service?.servicePricingName}`,
        "duration": `${this.bookingData?.service?.serviceTime}`,
        "serviceName": `${this.bookingData?.service?.serviceName}`,
        "booking_reference": aptData.booking_reference,
      }
    };
    console.log(Body)
    this.httpService.post(`checkout?ownerId=${this.bookingData?.shop?.ownerId}`, Body).subscribe(
      res => {
        if(res.status == 200) {
          this.update_appointment(aptData);
        } else {
        this.newToast.error(res.error);
        }
      },
      err => {
        console.log(err);
        if(err.error === 'Payment Done') {
          this.submitted = false;
          this.paymentDone = true;
        }
        this.newToast.error(err.error);
      }
    );
  }
  wallet_checkhout(aptData) {
    let body = {
      "amount": this.total_amount,
      "currency": this.currency.name.toLowerCase(),
      "description": "Appointment created from BookUs Web App",
      "appointmentId": aptData._id,
      "metadata": {
        "clientName": `${this.userData?.result?.firstName} ${this.userData?.result?.lastName ? this.userData?.result?.lastName : ''}`,
        "therapist": `${this.bookingData?.therapist?.firstName}`,
        "bookedFrom": "PWA",
        "startTime": `${this.bookingData?.startTime}`,
        "endTime": `${this.bookingData?.endTime}`,
        "service_pricing_name": `${this.bookingData?.service?.servicePricingName}`,
        "duration": `${this.bookingData?.service?.serviceTime}`,
        "serviceName": `${this.bookingData?.service?.serviceName}`,
        "booking_reference": aptData.booking_reference,
      }
    }
    this.httpService.post(`wallet?ownerId=${this.bookingData?.shop?.ownerId}`, body)
    .subscribe(data => {
      if (data['status'] == 200) {
        console.log(data);
        this.update_appointment(aptData);
      } else {
        this.newToast.error(data['message']);
        console.log(data);
      }
    })
  }
  update_appointment(aptData) {
    const forSales: string[] = ['wallet','card']; //exclude 'loyalty points', 'gift card'
    let payload = aptData
    payload.appointment_paid_online = true;
    payload.isPaid = true;
    payload.status = 'new';
    payload.checkout = false;// Set to false because platform need to double check if payment received
    console.log("aptData", aptData);
    console.log("Appointmnet Response: ", payload);
    this.httpService.put(`update_appointment/${aptData._id}`, payload)
    .subscribe(res => {
      console.log(res);
      if(forSales.includes(String(this.paymentType))) {
        this.sales(res);
      } else {
        this.submitted = false;
        this.openAppointmentBookedSuccessModel();
        this.router.navigate(['/schedule']);
      }
    })
  }
  confirmationNotification(id: string) {
    let body = {
      appointmentId: id,
      ianaTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    this.httpService.post('client_notifications/confirmationNotification', body).subscribe();
  }

  rescheduleNotification(id: string) {
    // TODO: This triggers for all appointment edit, not just rescheds
    let body = {
      appointmentId: id,
      ianaTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    this.httpService.post('client_notifications/rescheduleNotification', body).subscribe();
  }

  /**
   * @deprecated Deprecated, use confirmationNotification or rescheduleNotification
   * @param id 
   */
  notifyCustomer(id) {
    this.httpService.post(`notify_customer`, {appointmentId: id})
    .subscribe(res =>{
      console.log(res)
    })
  }

  sales(res) {
    let data = res.result[0]
    let body = {
      appointment:[
         {
            appointmentId: data.Id,
            _type:"",
            commission:0,
            hourly_commission:0,
            discount:0,
            discountType:"none",
            amount: data.price,
            service: data.service.id,
            staff:{
               _id: data.staff?.id,
               firstName: data.staff?.firstName,
               lastName: data.staff?.lastName
            }
         }
      ],
      loyaltyPointsOnReview: this.loyaltyPointsOnReview,
      totalAmount: data.price,
      totalDiscount:{
         totalDiscountAmount:0,
         totalDisocuntPercentage:0
      },
      tips:[],
      payment: data.payment,
      location: data.location,
      category: "appointment",
      ownerId: data.ownerId,
      clientId: data.client
    }
    if(this.diffPaymentMethod !== 'payInStore') {
      this.httpService.post(`appointment_sales`, body)
      .subscribe((res)=>{
        console.log(res);
        let modalData = {
          serviceName: this.bookingData?.service?.serviceName,
          duration: this.bookingData?.service?.serviceTime,
        }
        this.openPaymentSuccessModel(modalData);
        this.router.navigate(['/schedule']);
      })
    }
  }
}
