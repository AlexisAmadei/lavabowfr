alter table merch_items drop column quantity;
alter table merch_items add column out_of_stock boolean not null default false;