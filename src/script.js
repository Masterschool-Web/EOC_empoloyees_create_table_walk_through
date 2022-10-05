// DON'T EDIT THOSE LINES
const dataURLBase = "https://docs.google.com/spreadsheets/d/";
const dataURLEnd = "/gviz/tq?tqx=out:json&tq&gid=";
const id = "1C1-em4w0yHmd2N7__9cCSFzxBEf_8r74hQJBsR6qWnE";
const gids = ["0", "1574569648", "1605451198"];
// END OF DATA SETUP

// TODO: fetch all the data
// TODO: combine all of it together (fetch 3 different sheets) -> employee -> name, lname, salary, date
// TODO: render a table
// TODO: render a table row for each entry (employee ) -> name | lname | saraly | date

(async () => {
  // TODO: fetch all the data
  const responses = await Promise.all(
    gids.map(async (gid, index) => {
      const response = await fetch(dataURLBase + id + dataURLEnd + gid);
      const data = await response.text();
      const formatData = JSON.parse(data.slice(47, -2));
      const rows = formatData.table.rows;

      if (rows.length === 11) {
        return rows.slice(1); // [1, ...]
      }

      return rows;
    })
  );

  console.log(responses);

  // TODO: combine all of it together (fetch 3 different sheets) -> employee -> name, lname, salary, date

  /*
    [
      {
        firstName: "",
        lastName: "",
        date: ""
        salary: ""
      },
      {

      },
      {

      }
    ]
  */

  // const employees = [];
  // for (let i = 0; i < 10; i++) {
  //   employees.push({
  //     firstName: responses[0][i].c[0].v,
  //     lastName: responses[0][i].c[1].v,
  //     date: responses[1][i].c[0].v.slice(7, -1).replaceAll(",", "/"),
  //     salary: responses[2][i].c[0].v,
  //   });
  // }

  const formatDate = (date) => {
    const dateParts = date.split("/");

    const formattedParts = dateParts.map((part) => {
      if (part.length === 1) {
        return "0" + part;
      }

      return part;
    });

    return formattedParts.join(".");
  };

  const employees = responses[0].map((employee, index) => ({
    ["First Name"]: responses[0][index].c[0].v,
    ["Last Name"]: responses[0][index].c[1].v,
    Date: formatDate(responses[1][index].c[0].f),
    Salary:
      responses[2][index].c[0].v
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "$",
  }));

  const table = document.getElementById("employees");
  table.classList.add("table");
  table.classList.add("table-striped");

  const head = document.createElement("thead");
  head.classList.add("thead-dark");

  table.appendChild(head);

  const tr = document.createElement("tr");

  head.appendChild(tr);

  // take all the jeys: fname lanme data salary
  // create a th (table head) for each key, that will be the category

  const categories = Object.keys(employees[0]);

  categories.forEach((category) => {
    const th = document.createElement("th");
    const text = document.createTextNode(category);
    th.appendChild(text);
    th.setAttribute("scope", "col");
    tr.appendChild(th);
  });

  const body = document.createElement("tbody");
  table.appendChild(body);

  employees.forEach((employee) => {
    const tr = document.createElement("tr");
    const values = Object.values(employee);

    console.log(values);
    values.forEach((value) => {
      const td = document.createElement("td");
      const text = document.createTextNode(value);
      td.appendChild(text);
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
})();
