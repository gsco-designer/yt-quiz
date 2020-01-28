function YTGSQZ() {

	var self = this;

	self.loaded = function() {

		self.click_handlers_installed = false;

		jQuery("#take_quiz").on("click", self.start_quiz);
/*
				jQuery(".quarter").hover(

					function() { $(this).css("border", self.BORDER_RED) },

					function() { $(this).css("border", self.BORDER_WHITE) }

				);
*/
		self.WHITE = jQuery(".quarter img:eq(0)").attr("src");	// tuck away for network perf
/*
				launch_url = "", argument_trigger = "QTO=";

				try {

					var launch_url = window.location.href;

				} catch (e) {

				}

				if (launch_url.indexOf(argument_trigger)) {

					var params = launch_url.substring(launch_url.indexOf(argument_trigger),255).split("&");

					var args_results_ms = params[0].substr(argument_trigger.length), args_scored_ms = null;

					if (params.length > 1) args_scored_ms = params[1].substr(argument_trigger.length);

					if (parseInt(args_results_ms,10)) {

						self.TIMEOUT_MILLISEC_question = parseInt(args_results_ms,10);

					}

					if (args_scored_ms & parseInt(args_scored_ms,10)) {

						self.TIMEOUT_MILLISEC_scored = parseInt(args_scored_ms,10);

					}

				}

			console.log("Working RESULTS timeout (milliseconds) = " + self.TIMEOUT_MILLISEC_question);

			console.log("Working SCORED timeout (milliseconds) = " + self.TIMEOUT_MILLISEC_scored);
*/
	}

	self.start_quiz = function() {

		jQuery("#G1").fadeOut("fast", function() {

			self.scored = "";

			self.show(1);

		});

		self.stop_results_timeout();

		self.stop_scored_timeout();

	}

	self.retake_quiz = function() {

		self.scored = "";

		jQuery(".panel").hide();

		jQuery("#G1").show();

		self.stop_results_timeout();

		self.stop_scored_timeout();

	}

	self.show_quiz_questions = function (visible) {

		if (visible) {

			jQuery("#G2").fadeIn("fast");

		} else {

			jQuery("#G2 img").attr("src", self.WHITE);

			jQuery("#G2").fadeOut("fast");

		};

		self.start_results_timeout();

	}

	self.show = function (question) {

		jQuery("#posed").html(Q.questions[question-1]);

		self.setChoices(Q.images[question-1]);

		if (!self.click_handlers_installed) {

			self.bdbx.forEach(function(id, n) {

				jQuery(id).on("click", self.clicked);

				jQuery(id).attr("ascii", String.fromCharCode(n + 97));

			});

			jQuery("#retake").on("click", self.retake_quiz);

			self.click_handlers_installed = 0x1;

		}

		self.show_quiz_questions(true);

	}

	self.setChoices = function(images) {

		self.bdbx.forEach(function(element, n) {

			jQuery(element + " img").attr("src", images[n].src);

			jQuery(element + " div").html(images[n].caption);

		});

	}

	self.get_event_source = function() {

	  var event = event || window.event;

	  return event.target || event.srcElement;

	}

	self.clicked = function() {

		var selected_response = 'a';

		self.stop_results_timeout();

		jQuery(".quarter").css("border", self.BORDER_WHITE);

		try {

			selected_response = self.get_event_source().getAttribute("ascii");

		} catch (e) {

			console.info("Selection error!");

		}

		self.scored += selected_response;

		if (self.scored.length > 4) {

			jQuery("#G3 img").attr("src", self.WHITE);

			jQuery("#G2 img").attr("src", self.WHITE);

			self.score();

		} else {

			jQuery("#G2 img").attr("src", self.WHITE);

			jQuery("#G2").fadeOut("fast", function() {

				self.show(self.scored.length+1);

			});

		}

	}

	self.score = function() {

		var mapped = 1; //default

		jQuery("#G2 img").attr("src", self.WHITE);

		if (Q.mapped.hasOwnProperty(self.scored)) {

			mapped = Q.mapped[self.scored];

		}

		jQuery("#G2").fadeOut("fast", function() {

			jQuery("#G3 #creator").html(Q.channels[mapped-1].creator);

			jQuery("#G3 img").attr("src",Q.channels[mapped-1].src);

			jQuery("#G3 #subs").html(Q.channels[mapped-1].subs);

			jQuery("#G3 p").html(Q.channels[mapped-1].text);

			jQuery("#G3").fadeIn("fast");

		});

		self.start_scored_timeout();

	}

	self.start_results_timeout = function() {

		if (!self.TIMEOUT_results) {

			self.TIMEOUT_results = setTimeout(function() {

				self.retake_quiz();

			}, self.TIMEOUT_MILLISEC_question);

		}

	}

	self.stop_results_timeout = function() {

		if (self.TIMEOUT_results) {

			clearTimeout(self.TIMEOUT_results);

			self.TIMEOUT_results = null;

		}

	}

	self.start_scored_timeout = function() {

		if (!self.TIMEOUT_results) {

			self.TIMEOUT_scored = setTimeout(function() {

				self.retake_quiz();

			}, self.TIMEOUT_MILLISEC_scored);

		}

	}

	self.stop_scored_timeout = function() {

		if (self.TIMEOUT_scored) {

			clearTimeout(self.TIMEOUT_scored);

			self.TIMEOUT_scored = null;

		}

	}

	self.click_handlers_installed = false;

	self.bdbx = ["#qzia","#qzib","#qzic","#qzid"];

	self.scored = "";

	self.WHITE = "";	// dynamically acquired src

	self.BORDER_RED = "10px solid #ff0000";

	self.BORDER_WHITE = "10px solid #ffffff";

	self.TIMEOUT_MILLISEC_question = 60000;

	self.TIMEOUT_MILLISEC_scored = 45000;

	self.TIMEOUT_results = null;

	self.TIMEOUT_scored = null;

}

const ytgsqz = new YTGSQZ;

window.onload = function() { ytgsqz.loaded(); }
