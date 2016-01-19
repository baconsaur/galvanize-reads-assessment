
exports.up = function(knex, Promise) {
	return knex.schema.createTable('books', function(table) {
		table.increments().primary();
		table.string('title');
		table.integer('genre').references('id').inTable('genres');
		table.text('cover_url');
		table.text('description');
	});
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
