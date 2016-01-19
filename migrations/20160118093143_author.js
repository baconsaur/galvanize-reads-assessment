
exports.up = function(knex, Promise) {
	return knex.schema.createTable('authors', function (table) {
		table.increments().primary();
		table.string('first_name');
		table.string('last_name');
		table.text('portrait_url');
		table.text('biography');
	});
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('authors');
};
