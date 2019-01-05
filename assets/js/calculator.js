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

    isFixed: false,
    isCombined: false,

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

        this.floatRate = 0;
        this.floatPeriod = 0;
        this.isFixed = this.isCombined = false;
        if ($('#cbo-rate option:selected').attr('data-float-rate') != null) {
            this.isCombined = true;
            this.fixedPeriod = parseInt($('#cbo-rate option:selected').attr('data-fixed-period'));
            this.floatRate = parseFloat($('#cbo-rate option:selected').attr('data-float-rate'));
            this.floatPeriod = this.tenor - this.fixedPeriod;
        } else {
            this.isFixed = true;
            this.fixedPeriod = this.tenor;
        }

        this.fixedRate = parseFloat($('#cbo-rate').val());
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
        const loanAmount = parseInt($('#txt-loan-amount').val());

        var amountInterestFixedRate = 0;
        var amountInterestFloatRate = 0;

        var formula = "";
        var formulaOptions = "";
        if (this.isFixed) {
            amountInterestFixedRate = Math.ceil(loanAmount * this.fixedRate/100 * this.fixedPeriod);

            formula = db.formula.fixed;
            formulaOptions = {
                loan_amount: loanAmount,
                rate: this.fixedRate,
                period_time: this.tenor
            };
        } else {
            amountInterestFixedRate = Math.ceil(loanAmount * this.fixedRate/100 * this.fixedPeriod);
            amountInterestFloatRate = Math.ceil(loanAmount * this.floatRate/100 * this.floatPeriod);

            formula = db.formula.combined;
            formulaOptions = {
                loan_amount: loanAmount,
                fixed_rate: this.fixedRate,
                fixed_period: this.fixedPeriod,
                float_rate: this.floatRate,
                period_time: this.tenor
            };
        }

        var parser = new exprEval.Parser();
        parser.consts = formulaOptions;
        var installment = Math.ceil(parser.parse(formula).evaluate());
        console.log("formula (installment) :: "+ parser.parse(formula).toString());
        console.log("installment :: "+ installment);

        const totalLoanAmount = loanAmount + amountInterestFixedRate + amountInterestFloatRate;
        const result = this.installments(installment, totalMonths, totalLoanAmount);

        return result;

    },

    installments: function (
        installment,
        totalMonths,
        totalLoanComplete
    ) {
        const list = new Array();
        let totalInstallments = 0;

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
