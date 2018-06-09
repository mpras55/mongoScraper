$(document).on("click", ".btn-primary", function () {
	console.log("News button");
	console.log(this.id);
	var newsCategory = this.id;
	$.ajax({
		type: "POST",
		url: "/getnews",
		dataType: "json",
		data: {
			category: this.id
		}
	})
		.then(function (data) {
			console.log(data);
			$("#news-area").empty();
			for (let index = 0; index < data.length; index++) {
				var newDiv = $("<div>");

				var newPara = $("<a>")
				newPara.html("<h3>" + data[index].headline + "</h3>");
				newPara.attr("href", data[index].url);
				newPara.attr("target", "_blank");
				newDiv.append(newPara);
				newDiv.append("<br>");

				var newButton = $("<button>");
				newButton.html("Save");
				newButton.attr("class", "btn btn-info btn-lg");
				newButton.attr("data-headline", data[index].headline);
				newButton.attr("data-url", data[index].url);
				// newButton.attr("id",data[index].url);
				newButton.attr("data-category", newsCategory);
				newDiv.append(newButton);

				$("#news-area").append(newDiv);
				$("#news-area").append("<br><br>");
			}
			// getUnread();
			// $("#author").val("");
			// $("#title").val("");
		}
		);
	// return false;
});

$(document).on("click", ".btn-info", function () {
	console.log($(this).data("headline"), $(this).data("url"));

	$.ajax({
		type: "POST",
		url: "/savenews",
		dataType: "json",
		data: {
			headline: $(this).data("headline"),
			url: $(this).data("url"),
			category: $(this).data("category")
		}
	})
		.then(function (data) {
			console.log(data);
			}
		);
		$(this).attr("class", "btn btn-warning btn-lg");
		$(this).html("Saved");
});