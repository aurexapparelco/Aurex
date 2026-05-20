import { createClient } from "@/lib/supabase/server";
import {
  SHIPPING_ZONES,
  FREE_SHIPPING_THRESHOLD,
  BANK_DETAILS,
} from "@/lib/constants";
import type { Settings } from "@/types/database.types";

export interface BankSettings {
  bank: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}

export interface ShippingZoneConfig {
  fee: number;
  days: string;
}

export interface ShippingSettings {
  zones: {
    Colombo: ShippingZoneConfig;
    Suburbs: ShippingZoneConfig;
    "Other Districts": ShippingZoneConfig;
  };
  freeThreshold: number;
}

export interface FooterSettings {
  socialFacebook: string;
  socialInstagram: string;
  socialTiktok: string;
  whatsappNumber: string;
  whatsappPrefill: string;
  businessOpenDay: string;
  businessCloseDay: string;
  businessOpenTime: string;
  businessCloseTime: string;
  holidayNote: string;
  brandTagline: string;
  copyrightSuffix: string;
}

export interface AppSettings {
  bank: BankSettings;
  shipping: ShippingSettings;
  footer: FooterSettings;
}

export async function getSettings(): Promise<AppSettings> {
  const supabase = await createClient();
  const { data: raw } = await supabase.from("settings").select("*").single();
  const data = raw as unknown as Settings | null;

  if (!data) return getDefaults();

  return {
    bank: {
      bank: data.bank_name,
      accountName: data.bank_account_name,
      accountNumber: data.bank_account_number,
      branch: data.bank_branch,
    },
    shipping: {
      zones: {
        Colombo: { fee: data.zone_colombo_fee, days: data.zone_colombo_days },
        Suburbs: { fee: data.zone_suburbs_fee, days: data.zone_suburbs_days },
        "Other Districts": {
          fee: data.zone_other_fee,
          days: data.zone_other_days,
        },
      },
      freeThreshold: data.free_shipping_threshold,
    },
    footer: {
      socialFacebook: data.social_facebook_url,
      socialInstagram: data.social_instagram_url,
      socialTiktok: data.social_tiktok_url,
      whatsappNumber: data.whatsapp_number,
      whatsappPrefill: data.whatsapp_prefill_message,
      businessOpenDay: data.business_hours_open_day,
      businessCloseDay: data.business_hours_close_day,
      businessOpenTime: data.business_hours_open_time,
      businessCloseTime: data.business_hours_close_time,
      holidayNote: data.footer_holiday_note,
      brandTagline: data.footer_brand_tagline,
      copyrightSuffix: data.footer_copyright_suffix,
    },
  };
}

export function getDefaults(): AppSettings {
  return {
    bank: {
      bank: BANK_DETAILS.bank,
      accountName: BANK_DETAILS.accountName,
      accountNumber: BANK_DETAILS.accountNumber,
      branch: BANK_DETAILS.branch,
    },
    shipping: {
      zones: {
        Colombo: {
          fee: SHIPPING_ZONES.Colombo.fee,
          days: SHIPPING_ZONES.Colombo.days,
        },
        Suburbs: {
          fee: SHIPPING_ZONES.Suburbs.fee,
          days: SHIPPING_ZONES.Suburbs.days,
        },
        "Other Districts": {
          fee: SHIPPING_ZONES["Other Districts"].fee,
          days: SHIPPING_ZONES["Other Districts"].days,
        },
      },
      freeThreshold: FREE_SHIPPING_THRESHOLD,
    },
    footer: {
      socialFacebook: "",
      socialInstagram: "",
      socialTiktok: "",
      whatsappNumber: "94717660101",
      whatsappPrefill: "Hi Aurex! I need some help.",
      businessOpenDay: "Mon",
      businessCloseDay: "Fri",
      businessOpenTime: "09:00",
      businessCloseTime: "18:00",
      holidayNote: "Responses may be delayed on public holidays in Sri Lanka.",
      brandTagline: "Premium Menswear",
      copyrightSuffix: "Auréx. All rights reserved.",
    },
  };
}
