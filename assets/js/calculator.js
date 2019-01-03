const monthNamesEN = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthNamesID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const thousandSeparator = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const calculator = {
    propertyPrice: 0, // in rupiah
    downPayment: 0, // in rupiah, minimum 15% of property price
    tenor: 0, // in year

    fixedRate: 0.0, // in percentage
    fixedPeriod: 0, // in year

    floatRate: 11.5, // in percentage, default/maximum float rate
    floatPeriod: 0, // in year

    startMonth: 0, // index of month, 0 = january

    provisionFee: 0, // 1% of total loan

    /**
     * Initialize parameters
     */
    init: function () {
        this.propertyPrice = parseInt($('#txt-property-price').val());
        this.downPayment = parseInt($('#txt-down-payment').val());
        this.tenor = parseInt($('#cbo-tenor').val());

        this.fixedRate = parseInt($('#cbo-rate').val());
        this.fixedPeriod = 3;

        this.floatRate = this.fixedRate;
        this.floatPeriod = this.tenor - this.fixedPeriod;
    },

    /**
     * The return of this function are contains
     * list of month, installment monthly, principal installment, interest installment & loan balance
     *
     * @return {Array}
     */
    compute: function () {
        this.init();

        const totalMonths = this.tenor * 12;
        const totalLoan = this.propertyPrice - this.downPayment;

        // console.log("total loan :: "+ totalLoan);

        const totalAmountInterestFixedRate = totalLoan * this.fixedRate/100 * this.fixedPeriod;
        // const amountInterestFixedRatePerMonth = Math.ceil(totalInterestFixedRate / (this.fixedPeriod * 12)); // rounding up
        // console.log("totalAmountInterestFixedRate :: "+ totalAmountInterestFixedRate);

        const totalAmountInterestFloatRate = Math.ceil(totalLoan * this.floatRate/100 * this.floatPeriod);
        // const amountInterestFloatRatePerMonth = Math.ceil(totalInterestFloatRate / (this.floatPeriod * 12)); // rounding up
        // console.log("totalAmountInterestFloatRate :: "+ totalAmountInterestFloatRate);

        const totalLoanComplete = totalLoan + totalAmountInterestFixedRate + totalAmountInterestFloatRate;
        

        // console.log("total months :: "+ totalMonths);
        // console.log("total loan complete :: "+ totalLoanComplete);

        const result = this.installments(totalMonths, totalLoanComplete);
        // console.log(result[0]);

        return result;
    },

    installments: function (
        totalMonths,
        totalLoanComplete
    ) {
        const list = new Array();
        let totalInstallments = 0;

        const installment = Math.ceil(totalLoanComplete / totalMonths);
        const principalInstallment = 0;
        const interestInstallment = 0;

        for (var i = 0; i < totalMonths; i++) {
            let currentRate;
            if ((i + 1) <= (this.fixedPeriod * 12)) {
                currentRate = this.fixedRate;
            } else {
                currentRate = this.floatRate;
            }

            totalInstallments += installment;
            loanBalance = totalLoanComplete - totalInstallments;
            if (loanBalance < 0) {
                loanBalance = 0;
            }

            list.push({
                'sequence_number': i + 1,
                'month': monthNamesID[i % 12],
                'installment': "Rp "+ thousandSeparator(installment),
                'principal_installment': "Rp "+ thousandSeparator(principalInstallment),
                'interest_installment': "Rp "+ thousandSeparator(interestInstallment),
                'rate': currentRate +"%",
                'loan_balance': "Rp "+ thousandSeparator(loanBalance),
            });
        }

        return list;
    }
};












