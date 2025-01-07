package org.example.pi5.Services;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.example.pi5.entities.CandlestickData;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExcelDataService {

    private final Map<String, List<CandlestickData>> cache = new HashMap<>();

    public List<CandlestickData> readExcelData(String filePath) throws IOException {
        if (cache.containsKey(filePath)) {
            return cache.get(filePath); // Return cached data
        }

        List<CandlestickData> data = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(new File(filePath))) {
            Sheet sheet = workbook.getSheet("Candlestick Data");
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header row

                LocalDateTime dateTime = LocalDateTime.parse(row.getCell(0).getStringCellValue(), DateTimeFormatter.ISO_DATE_TIME);
                double open = row.getCell(1).getNumericCellValue();
                double high = row.getCell(2).getNumericCellValue();
                double low = row.getCell(3).getNumericCellValue();
                double close = row.getCell(4).getNumericCellValue();

                data.add(new CandlestickData(dateTime, open, high, low, close));
            }
        }

        cache.put(filePath, data); // Cache the data
        return data;
    }

    public void clearCache(String filePath) {
        cache.remove(filePath); // Clear cache for the specified filePath
    }
}
