function createMock()
{
	var me = {};
	me.mock = function(){
		
	};
	return me.mock;
}






QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});


QUnit.test( "a test", function( assert ) {
  assert.equal( 1, "1", "String '1' and number 1 have the same value" );
});

QUnit.test("should not be null", function(){
	
	var mock = createMock();
	ok(null !=mock);
});


