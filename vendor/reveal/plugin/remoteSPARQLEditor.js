const RemoteSPARQLEditor = {
  id: "remote-sparql-editor",
  init: function (reveal) {
    // Process all online-sparql code blocks on startup
    reveal.on("ready", function () {
      document
        .querySelectorAll("code.language-remote-sparql-editor")
        .forEach((block) => {
          const query = encodeURIComponent(block.textContent.trim());
          const iframe = document.createElement("iframe");
          iframe.src = `https://docs.ted.europa.eu/ted-open-data-explorer/editor.html#query=${query}&endpoint=https%3A%2F%2Fpublications.europa.eu%2Fwebapi%2Frdf%2Fsparql&requestMethod=POST&tabTitle=Query&headers=%7B%7D&contentTypeConstruct=application%2Fn-triples%2C*%2F*%3Bq%3D0.9&contentTypeSelect=application%2Fsparql-results%2Bjson%2C*%2F*%3Bq%3D0.9&outputFormat=table&outputSettings=%7B%22compact%22%3Afalse%2C%22isEllipsed%22%3Afalse%7D`;
          block.parentNode.replaceWith(iframe);
        });
    });
  },
};
