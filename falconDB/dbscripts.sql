create table t_invoicelist(
invoice_id INT PRIMARY KEY NOT NULL,
vendor_invoice_no VARCHAR(50) NOT NULL,
invoice_dt TEXT,
vendor varchar(100),
amount real,
inv_status varchar(10),
bank_transaction_id varchar(100),
payee_account_no varchar(100),
payee_routing_no varchar(100)
);

CREATE TABLE t_invoices(
invoice_no INT NOT NULL,
invoice_dt TEXT,
vendor_name varchar(100),
item_no INT  NOT NULL,
item_description varchar(200),
price_per_unit real,
no_of_units int,
total_cost real,
invoice_status varchar(10),
payer_account_no varchar(100),
payer_routing_no varchar(100), bank_transaction_id TEXT,
PRIMARY KEY (invoice_no, item_no)
);


insert into t_invoices (invoice_no, invoice_dt, vendor_name, item_no, item_description, price_per_unit, no_of_units, total_cost, invoice_status) values (1, '12/02/2022', 'JC Building Supplies', 1, 'Cabinets', 1600.00, 4, 6400.00, 'Unpaid');
insert into t_invoices (invoice_no, invoice_dt, vendor_name, item_no, item_description, price_per_unit, no_of_units, total_cost, invoice_status) values (1, '12/02/2022', 'JC Building Supplies', 2, 'Counters', 800.00, 6, 4800.00, 'Unpaid');
insert into t_invoices (invoice_no, invoice_dt, vendor_name, item_no, item_description, price_per_unit, no_of_units, total_cost, invoice_status) values (1, '12/02/2022', 'JC Building Supplies', 3, 'Doors', 80.00, 6, 480.00, 'Unpaid');
insert into t_invoices (invoice_no, invoice_dt, vendor_name, item_no, item_description, price_per_unit, no_of_units, total_cost, invoice_status) values (1, '12/02/2022', 'JC Building Supplies', 4, 'Floor Covering', 75.00, 4, 300.00, 'Unpaid');
insert into t_invoices (invoice_no, invoice_dt, vendor_name, item_no, item_description, price_per_unit, no_of_units, total_cost, invoice_status) values (1, '12/02/2022', 'JC Building Supplies', 5, 'Windows', 500.00, 3, 1500.00, 'Unpaid');
