document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("button").addEventListener("click", function () {
    const enlistedDate = document.getElementById("enlistedDate").value;
    const enlistedType = document.getElementById("enlistedType").value;

    if (!enlistedDate) {
      alert("입대일을 선택해주세요.");
      return;
    }

    const startDate = new Date(enlistedDate);
    const startYear = startDate.getFullYear();

    // 연도가 2022 이전이면 경고 메시지 표시
    if (startYear < 2022) {
      alert("입대일은 2022년 이후여야 합니다.");
      return;
    }
    if (startYear > 2027) {
      alert("입대일은 2027년 이전이어야 합니다.");
      return;
    }
    const tableContainer = document.getElementById("resultTableContainer");
    tableContainer.innerHTML = ""; // Clear previous table if any

    const table = document.createElement("table");
    table.border = "1";

    const headerRow = document.createElement("tr");
    const headers = [
      "연번",
      "계급",
      "월급일",
      "월급",
      "월납입금",
      "공제 후 금액",
      "병일회용품비",
      "정부지원이자",
      "은행 이자",
      "정부 매칭 지원금",
      "비고",
    ];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // 테이블 데이터를 배열로 관리
    const tableData = Array.from(
      { length: parseInt(enlistedType, 10) + 1 },
      () => Array(headers.length).fill(null)
    );

    function generateColumnData(rowIndex, colIndex) {
      let salaryDate, rank, year; // 상위 스코프에서 변수 선언

      switch (colIndex) {
        case 0: // 연번
          return rowIndex;

        case 1: // 계급
          const select = document.createElement("select");
          const ranks = ["이병", "일병", "상병", "병장"];

          // 연번에 따라 기본 계급 설정
          const serialNumber = rowIndex + 1; // 연번은 1부터 시작
          let defaultRank = "이병"; // 기본값
          if (serialNumber >= 4 && serialNumber <= 9) {
            defaultRank = "일병";
          } else if (serialNumber >= 10 && serialNumber <= 15) {
            defaultRank = "상병";
          } else if (serialNumber >= 16) {
            defaultRank = "병장";
          }

          // 테이블 데이터에 저장된 값이 있으면 해당 값 사용, 없으면 기본값 사용
          const currentRank = tableData[rowIndex][colIndex] || defaultRank;

          ranks.forEach((rank) => {
            const option = document.createElement("option");
            option.value = rank;
            option.textContent = rank;

            // 저장된 값 또는 기본값을 선택
            if (rank === currentRank) {
              option.selected = true;
            }

            select.appendChild(option);
          });

          select.addEventListener("change", () => {
            tableData[rowIndex][colIndex] = select.value; // Update tableData on change
            updateTable(); // Recalculate dependent cells
          });

          // Set initial value in tableData if not already set
          if (!tableData[rowIndex][colIndex]) {
            tableData[rowIndex][colIndex] = defaultRank; // Set default rank based on 연번
          }

          return select;

        case 2: // 월급일
          if (rowIndex === 0) {
            // 첫 번째 행의 경우 입대일을 그대로 사용
            const dateString = startDate.toISOString().split("T")[0];
            tableData[rowIndex][colIndex] = dateString; // Store in tableData
            return dateString;
          } else if (rowIndex === tableData.length - 1) {
            // 마지막 행의 경우 전역일 계산
            const dischargeDate = new Date(startDate);
            dischargeDate.setMonth(
              startDate.getMonth() + parseInt(enlistedType, 10)
            ); // 복무 기간 추가
            dischargeDate.setDate(dischargeDate.getDate() - 1); // 하루 빼기
            const dateString = dischargeDate.toISOString().split("T")[0];
            tableData[rowIndex][colIndex] = dateString; // Store in tableData
            return dateString;
          } else {
            // 나머지 행의 경우 기존 로직 유지
            const promotionDate = new Date(startDate);
            promotionDate.setMonth(startDate.getMonth() + rowIndex);
            promotionDate.setDate(10); // Set to the 10th day of the month
            const dateString = promotionDate.toISOString().split("T")[0];
            tableData[rowIndex][colIndex] = dateString; // Store in tableData
            return dateString;
          }
        case 3: // 월급
          salaryDate = tableData[rowIndex][2]; // Get 월급일 (C1)
          rank = tableData[rowIndex][1]; // Get 계급 (B1)
          if (!salaryDate || !rank) return 0;

          year = new Date(salaryDate).getFullYear(); // Extract year from 월급일
          let salary = 0;

          // 월급 계산 (기존 로직)
          if (year === 2024) {
            if (rank === "이병") salary = 640000;
            if (rank === "일병") salary = 800000;
            if (rank === "상병") salary = 1000000;
            if (rank === "병장") salary = 1250000;
          } else if (year === 2025) {
            if (rank === "이병") salary = 750000;
            if (rank === "일병") salary = 900000;
            if (rank === "상병") salary = 1200000;
            if (rank === "병장") salary = 1500000;
          } else if (year === 2026) {
            if (rank === "이병") salary = 750000;
            if (rank === "일병") salary = 900000;
            if (rank === "상병") salary = 1200000;
            if (rank === "병장") salary = 1500000;
          } else if (year === 2027) {
            if (rank === "이병") salary = 750000;
            if (rank === "일병") salary = 900000;
            if (rank === "상병") salary = 1200000;
            if (rank === "병장") salary = 1500000;
          } else if (year === 2023) {
            if (rank === "이병") salary = 600000;
            if (rank === "일병") salary = 680000;
            if (rank === "상병") salary = 800000;
            if (rank === "병장") salary = 1000000;
          } else if (year === 2022) {
            if (rank === "이병") salary = 510100;
            if (rank === "일병") salary = 552100;
            if (rank === "상병") salary = 610200;
            if (rank === "병장") salary = 676100;
          }

          if (rowIndex === 0) {
            // 첫 번째 행의 경우 추가 계산 수행
            const firstRowDate = new Date(tableData[0][2]); // 첫 번째 행의 case 2 값 (date)
            if (isNaN(firstRowDate)) return 0; // 날짜 값이 유효하지 않으면 0 반환

            // 해당 월의 마지막 날짜 계산
            const lastDayOfMonth = new Date(
              firstRowDate.getFullYear(),
              firstRowDate.getMonth() + 1,
              0
            ).getDate();

            const multiplier = lastDayOfMonth - firstRowDate.getDate(); // 마지막 날짜에서 첫 번째 행의 날짜 값 차감
            salary = (salary / lastDayOfMonth) * multiplier; // 계산
            salary = Math.round(salary); // 소숫점 반올림
          } else if (rowIndex === tableData.length - 1) {
            // 마지막 행의 경우 추가 계산 수행
            const lastRowDate = new Date(tableData[rowIndex][2]); // 마지막 행의 case 2 값 (date)
            if (isNaN(lastRowDate)) return 0; // 날짜 값이 유효하지 않으면 0 반환

            // 해당 월의 마지막 날짜 계산
            const lastDayOfMonth = new Date(
              lastRowDate.getFullYear(),
              lastRowDate.getMonth() + 1,
              0
            ).getDate();

            const multiplier = lastRowDate.getDate(); // 마지막 행의 날짜 값
            salary = (salary / lastDayOfMonth) * multiplier; // 계산
            salary = Math.round(salary); // 소숫점 반올림
          }

          tableData[rowIndex][colIndex] = salary; // Store in tableData
          return salary;

        case 4: // 월납입금
          if (rowIndex === 0) {
            // 첫 번째 행의 경우 빈 값 반환
            tableData[rowIndex][colIndex] = null; // Store empty value in tableData
            return ""; // Return empty string for display
          }

          salaryDate = tableData[rowIndex][2]; // Get 월급일 (C1)
          if (!salaryDate) return 0; // 월급일이 없으면 0 반환

          year = new Date(salaryDate).getFullYear(); // Extract year from 월급일
          let deposit = 0;
          if (year === 2024) {
            deposit = 400000; // 월납입금 for 2024
          } else if (year === 2025) {
            deposit = 550000; // 월납입금 for 2025
          } else if (year === 2026) {
            deposit = 550000; // 월납입금 for 2026
          } else if (year === 2027) {
            deposit = 550000; // 월납입금 for 2027
          } else if (year === 2023) {
            deposit = 400000; // 월납입금 for 2023
          } else if (year === 2022) {
            deposit = 400000; // 월납입금 for 2022
          }

          tableData[rowIndex][colIndex] = deposit; // Store in tableData
          return deposit;

        case 5: // 공제 후 금액
          if (rowIndex === 0) {
            // 첫 번째 행의 경우 빈 값 반환
            tableData[rowIndex][colIndex] = null; // Store empty value in tableData
            return ""; // Return empty string for display
          }
          const salary1 = tableData[rowIndex][3] || 0; // Get 월급 (D1), 기본값 0
          const deposit1 = tableData[rowIndex][4] || 0; // Get 월납입금 (E1), 기본값 0
          return salary1 - deposit1; // 월급에서 월납입금을 차감한 값 반환
        case 6: // 병일회용품비
          if (rowIndex === 0) {
            // 첫 번째 행의 경우 빈 값 반환
            tableData[rowIndex][colIndex] = null; // Store empty value in tableData
            return ""; // Return empty string for display
          }
          salaryDate = tableData[rowIndex][2]; // Get 월급일 (C1)
          if (!salaryDate) return 0; // 월급일이 없으면 0 반환

          year = new Date(salaryDate).getFullYear(); // Extract year from 월급일
          let necessities = 0;
          if (year === 2024) {
            necessities = 11550; // 병일회용품 for 2024
          } else if (year === 2025) {
            necessities = 7510; // 병일회용품 for 2025
          } else if (year === 2026) {
            necessities = 7510; // 병일회용품 for 2026
          } else if (year === 2027) {
            necessities = 7510; // 병일회용품 for 2027
          }
          tableData[rowIndex][colIndex] = necessities; // Store in tableData
          return necessities;

        case 7: // 정부지원이자 1%
          if (rowIndex === 0) {
            // 첫 번째 행의 경우 빈 값 반환
            tableData[rowIndex][colIndex] = null; // Store empty value in tableData
            return ""; // Return empty string for display
          }

          const deposit2 = tableData[rowIndex][4] || 0; // Get 월납입금 (E1), 기본값 0
          const interestRate = 0.01; // 1% 이자율
          const totalMonths = parseInt(enlistedType, 10); // 적금 기간 (총 개월 수)
          const elapsedMonths = rowIndex - 1; // 지난 개월 수 (현재 행의 인덱스)

          if (!deposit2 || isNaN(deposit2)) {
            tableData[rowIndex][colIndex] = 0; // 월납입금이 없거나 유효하지 않으면 0 반환
            return 0;
          }

          // 이자 계산
          const remainingMonths = totalMonths - elapsedMonths; // 남은 개월 수
          let governmentInterest =
            (deposit2 * interestRate * remainingMonths) / totalMonths; // 이자 계산
          governmentInterest = Math.round(governmentInterest); // 반올림

          tableData[rowIndex][colIndex] = governmentInterest; // Store 이자 in tableData
          return governmentInterest;

        case 8: // 은행 이자 5%
          if (rowIndex === 0) {
            // 첫 번째 행의 경우 빈 값 반환
            tableData[rowIndex][colIndex] = null; // Store empty value in tableData
            return ""; // Return empty string for display
          }

          const deposit3 = tableData[rowIndex][4] || 0; // Get 월납입금 (E1), 기본값 0
          const interestRate2 = 0.05; // 5% 이자율
          const totalMonths2 = parseInt(enlistedType, 10); // 적금 기간 (총 개월 수)
          const elapsedMonths2 = rowIndex - 1; // 지난 개월 수 (현재 행의 인덱스)

          if (!deposit3 || isNaN(deposit3)) {
            tableData[rowIndex][colIndex] = 0; // 월납입금이 없거나 유효하지 않으면 0 반환
            return 0;
          }

          // 이자 계산
          const remainingMonths2 = totalMonths2 - elapsedMonths2; // 남은 개월 수
          let bankInterest =
            (deposit3 * interestRate2 * remainingMonths2) / totalMonths2; // 이자 계산
          bankInterest = Math.round(bankInterest); // 반올림

          tableData[rowIndex][colIndex] = bankInterest; // Store 이자 in tableData
          return bankInterest;

        case 9: // 정부 매칭 지원금
          if (rowIndex === 0) {
            tableData[rowIndex][colIndex] = null;
            return "";
          }

          // Ensure case 4 is calculated
          if (
            tableData[rowIndex][4] === null ||
            tableData[rowIndex][4] === undefined
          ) {
            tableData[rowIndex][4] = generateColumnData(rowIndex, 4);
          }

          const depositForMatching = tableData[rowIndex][4] || 0;
          let matchingRate = 1; // 기본 100%
          const salaryDateForMatching = tableData[rowIndex][2];
          if (salaryDateForMatching) {
            const matchingYear = new Date(salaryDateForMatching).getFullYear();
            if (matchingYear === 2023) matchingRate = 0.71;
            else if (matchingYear === 2022) matchingRate = 0.33;
            // 2024~2027은 1(100%) 유지
          }
          const matchingSupport = Math.round(depositForMatching * matchingRate);
          tableData[rowIndex][colIndex] = matchingSupport;
          return matchingSupport;
        default:
          return "";
      }
    }

    function updateTable() {
      // Clear and regenerate the table
      table.innerHTML = "";
      table.appendChild(headerRow);

      const totals = Array(headers.length).fill(0); // Reset totals

      for (let i = 0; i < tableData.length; i++) {
        const dataRow = document.createElement("tr");
        for (let j = 0; j < headers.length; j++) {
          const dataCell = document.createElement("td");
          const cellContent = generateColumnData(i, j);

          if (typeof cellContent === "number") {
            if (j === 0) {
              // 1열(연번)에는 "원"을 붙이지 않음
              dataCell.textContent = cellContent.toLocaleString();
            } else {
              dataCell.textContent = `${cellContent.toLocaleString()}원`;
            }
            totals[j] += cellContent; // Add to totals
          } else if (cellContent instanceof HTMLElement) {
            dataCell.appendChild(cellContent);
          } else {
            dataCell.textContent = cellContent;
          }

          dataRow.appendChild(dataCell);
        }
        table.appendChild(dataRow);
      }

      // Add totals row
      const totalsRow = document.createElement("tr");
      for (let j = 0; j < headers.length; j++) {
        const totalsCell = document.createElement("td");
        if (j === 0) {
          totalsCell.textContent = "총계"; // 첫 번째 열에 "총계" 표시
        } else if (j === 1 || j === 2 || j === 10) {
          // case 1, 2, 10에는 총계 출력하지 않음
          totalsCell.textContent = ""; // Leave empty
        } else if (typeof totals[j] === "number") {
          totalsCell.textContent = `${totals[j].toLocaleString()}원`;
        }
        totalsRow.appendChild(totalsCell);
      }
      table.appendChild(totalsRow);

      // Calculate 원금 (case 3 ) and 이익금 (case 4~9)
      const principal = totals[3] || 0; // case 3 총계
      const profit =
        (totals[4] || 0) +
        (totals[5] || 0) +
        (totals[6] || 0) +
        (totals[7] || 0) +
        (totals[8] || 0) +
        totals[9 || 0]; // case 4~9 총계

      // Add 원금과 이익금 to the result container
      const resultContainer = document.getElementById("resultTableContainer");
      const summary = document.createElement("div");
      summary.innerHTML = `
        <p>월급 원금: ${principal.toLocaleString()}원</p>
        <p>수익금: ${profit.toLocaleString()}원 <br/>(월납입금 + 공제 후 금액 +	병일회용품비 +	정부지원이자 +	은행 이자	+ 정부 매칭 지원금)</p>
      `;
      resultContainer.appendChild(summary);
    }

    updateTable(); // Initial table generation
    tableContainer.appendChild(table);
  });
});
