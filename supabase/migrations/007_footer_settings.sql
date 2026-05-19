alter table public.settings
  add column social_facebook_url        text not null default '',
  add column social_instagram_url       text not null default '',
  add column social_tiktok_url          text not null default '',
  add column whatsapp_number            text not null default '94717660101',
  add column whatsapp_prefill_message   text not null default 'Hi Aurex! I need some help.',
  add column business_hours_open_day    text not null default 'Mon',
  add column business_hours_close_day   text not null default 'Fri',
  add column business_hours_open_time   text not null default '09:00',
  add column business_hours_close_time  text not null default '18:00',
  add column footer_holiday_note        text not null default 'Responses may be delayed on public holidays in Sri Lanka.',
  add column footer_brand_tagline       text not null default 'Dressed for Every Chapter',
  add column footer_copyright_suffix    text not null default 'Aurex. All rights reserved.';
