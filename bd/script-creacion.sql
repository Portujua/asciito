create table TrainData (
	id int not null auto_increment,
	fecha datetime,
	data varchar(128) not null,
	charcode int not null,
	primary key(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8;