const installmentTable = `
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Month</th>
            <th scope="col">Installment per Month</th>
            <th scope="col">Principal</th>
            <th scope="col">Interest</th>
            <th scope="col">Rate</th>
            <th scope="col">Loan Balance</th>
          </tr>
        </thead>
        <tbody>
          {{content}}
        </tbody>
      </table>`;

const installmentRowTable = `
          <tr>
            <th scope="row">{{sequence}}</th>
            <td>{{month_name}}</td>
            <td>{{installment}}</td>
            <td>{{principal_installment}}</td>
            <td>{{interest_installment}}</td>
            <td>{{rate}}</td>
            <td>{{loan_balance}}</td>
          </tr>`;

const applyNowButton = `<button type="button" class="btn btn-primary">Apply Now</button>`;