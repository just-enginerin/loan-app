/*
  Title: home.component.ts
  Author: Erin Brady
  Date: 22 July 2023
  Description: Homepage component logic: Saving and calculating loan application.
*/

import { Component, OnInit, Input } from '@angular/core';
import { ILoan } from '../loan.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  loanForm: FormGroup

  loanEntry: ILoan
  monthlyPayment: number = 0
  totalInterest: number = 0

  constructor(private fb: FormBuilder) {
    this.loanForm = {} as FormGroup
    this.loanEntry = {} as ILoan
  }

  ngOnInit(): void {
    this.loanForm = this.fb.group({
      principle: [0, Validators.required],
      interestRate: [0, Validators.required],
      numOfYears: [0, Validators.required]
    })
  }

  get form() {
    return this.loanForm.controls
  }

  onSubmit(event: { currentTarget: { reset: () => void; }; }) {

    // Save form values
    this.loanEntry = {
      principle: this.form['principle'].value.toFixed(2),
      interestRate: this.form['interestRate'].value.toFixed(2),
      numOfYears: this.form['numOfYears'].value
    }

    event.currentTarget.reset()

    console.log(`Collected Loan info:\nPrinciple: ${this.loanEntry.principle}\nInterestRate: ${this.loanEntry.interestRate}\nNumber of years: ${this.loanEntry.numOfYears}`)

    this.calculateLoan()
  }

  calculateLoan() {
    const ratePerPeriod = this.loanEntry.interestRate / (12 * 100)
    const numOfPayments = this.loanEntry.numOfYears * 12

    // Calculate Monthly Payment
    const numerator = this.loanEntry.principle * ratePerPeriod * Math.pow(1 + ratePerPeriod, numOfPayments)
    const denominator = Math.pow(1 + ratePerPeriod, numOfPayments) - 1
    this.monthlyPayment = numerator / denominator

    // Calculate Total Interest Paid
    const totalRepayment = this.monthlyPayment * numOfPayments;
    this.totalInterest = totalRepayment - this.loanEntry.principle;

    console.log(`Monthly Payment: ${this.monthlyPayment}\n Total Interest: ${this.totalInterest}`);
  }

}
