export interface ProFormaInput {
  property: {
    units: number;
    monthly_rent_per_unit: number;
    occupancy_rate: number;
    annual_property_taxes: number;
    annual_insurance: number;
  };
  expenses: {
    management_fee_percent: number | null;
    management_fee_fixed: number | null;
    maintenance_per_unit_annual: number;
    utilities_monthly: number;
    hoa_monthly: number;
    other_monthly: number;
  };
  financing: {
    purchase_price: number;
    down_payment_amount: number;
    interest_rate: number;
    loan_term_years: number;
  };
}

export interface ProFormaOutput {
  revenue: {
    gross_potential_rent: number;
    vacancy_loss: number;
    effective_gross_income: number;
  };
  expenses: {
    management: number;
    maintenance: number;
    property_taxes: number;
    insurance: number;
    utilities: number;
    hoa: number;
    other: number;
    total_operating_expenses: number;
  };
  cash_flow: {
    net_operating_income: number;
    annual_debt_service: number;
    cash_flow_before_tax: number;
  };
  metrics: {
    cap_rate: number;
    cash_on_cash_return: number;
    debt_service_coverage_ratio: number;
  };
  monthly_summary: {
    gross_rent: number;
    effective_rent: number;
    operating_expenses: number;
    noi: number;
    debt_service: number;
    cash_flow: number;
  };
} 