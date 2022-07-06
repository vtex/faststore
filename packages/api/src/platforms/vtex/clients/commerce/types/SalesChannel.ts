export interface SalesChannel {
  Id:                    number;
  Name:                  string;
  IsActive:              boolean;
  ProductClusterId:      null;
  CountryCode:           string;
  CultureInfo:           string;
  TimeZone:              string;
  CurrencyCode:          string;
  CurrencySymbol:        string;
  CurrencyLocale:        number;
  CurrencyFormatInfo:    CurrencyFormatInfo;
  Origin:                null;
  Position:              number;
  ConditionRule:         null;
  CurrencyDecimalDigits: null;
}

export interface CurrencyFormatInfo {
  CurrencyDecimalDigits:    number;
  CurrencyDecimalSeparator: string;
  CurrencyGroupSeparator:   string;
  CurrencyGroupSize:        number;
  StartsWithCurrencySymbol: boolean;
}
