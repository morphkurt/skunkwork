// Implements SystemInterfaceFactory

// Convenience factory class to produce HTML5-specific SystemInterface objects
// based on the underlying system implementations.

var SystemInterfaceFactory = function () {
	this.build = function () {
		return new Conviva.SystemInterface(
		  new Time(),
		  new Timer(),
		  new Http(),
		  new Storage(),
		  new Metadata(),
		  new Logging()
		);
	};
};
