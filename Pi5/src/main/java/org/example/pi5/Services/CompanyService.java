package org.example.pi5.Services;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.pi5.entities.*;
import org.example.pi5.repositories.CompanyRepository;
import org.example.pi5.repositories.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class CompanyService {
    @Autowired
    GameRepository gameRepository;
    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    ExcelDataService excelDataService;
    /*public static List<CandlestickData> generateCandlestickData(
            double initialPrice,
            double volatility,
            double drift,
            List<String> trends,
            int minDays,
            int maxDays,
            int candlesPerDay,
            LocalDateTime startDate) {

        List<CandlestickData> candles = new ArrayList<>();
        Random random = new Random();
        double price = initialPrice;

        LocalDateTime currentDateTime = startDate;
        int minutesPerCandle = 24 * 60 / candlesPerDay;

        for (String trend : trends) {
            int duration = random.nextInt(maxDays - minDays + 1) + minDays;

            for (int i = 0; i < duration; i++) {
                for (int j = 0; j < candlesPerDay; j++) {
                    // Geometric Brownian Motion calculation with clamping and damping
                    double randomShock = Math.max(-0.05, Math.min(0.05, volatility * random.nextGaussian()));
                    double driftEffect = Math.max(drift - 0.5 * Math.pow(volatility, 2), -0.001);
                    price *= Math.exp(driftEffect + randomShock);

                    // Clamp price to avoid runaway growth or collapse
                    price = Math.max(1, Math.min(price, initialPrice * 3));

                    double open = price;
                    double high = price * (1 + random.nextDouble() * 0.002);
                    double low = price * (1 - random.nextDouble() * 0.002);
                    double close = Math.max(low, Math.min(high, price * (0.98 + random.nextDouble() * 0.004)));

                    // Apply trend influence
                    if ("up".equalsIgnoreCase(trend)) {
                        close *= 1.002;
                    } else if ("down".equalsIgnoreCase(trend)) {
                        close *= 0.098;
                    }

                    // Clamp close price as well after trend influence
                    close = Math.max(low, Math.min(high, close));

                    // Create and add the candlestick
                    LocalDateTime candleTime = currentDateTime.plus(i, ChronoUnit.DAYS)
                            .plus(j * minutesPerCandle, ChronoUnit.MINUTES);

                    CandlestickData candle = new CandlestickData(candleTime, open, high, low, close);
                    candles.add(candle);
                }
            }

            // Increment current date for the next trend
            currentDateTime = currentDateTime.plus(duration, ChronoUnit.DAYS);
        }

        return candles;
    }*/
    public static List<CandlestickData> generateCandlestickData(
            double initialPrice,
            double volatility,
            double drift,
            List<String> trends,
            int totalDays,
            int candlesPerDay,
            LocalDateTime startDate) {

        List<CandlestickData> candles = new ArrayList<>();
        Random random = new Random();
        double price = initialPrice;

        LocalDateTime currentDateTime = startDate;
        int minutesPerCandle = 24 * 60 / candlesPerDay;

        // Split totalDays into trend durations
        List<Integer> trendDurations = splitTotalDays(totalDays, trends.size());

        for (int trendIndex = 0; trendIndex < trends.size(); trendIndex++) {
            String trend = trends.get(trendIndex);
            int duration = trendDurations.get(trendIndex);

            for (int i = 0; i < duration; i++) {
                for (int j = 0; j < candlesPerDay; j++) {
                    double randomShock = volatility * random.nextGaussian();
                    double driftEffect = (drift - 0.5 * Math.pow(volatility, 2));
                    //price *= Math.exp(driftEffect + randomShock);

                    double open = price;
                    double high = price * (1 + random.nextDouble() * 0.02)*Math.exp(driftEffect + randomShock);
                    double low = price * (1 - random.nextDouble() * 0.02)*Math.exp(driftEffect + randomShock);
                    double close = price * (0.98 + random.nextDouble() * 0.04)*Math.exp(driftEffect + randomShock);

                    // Apply trend influence
                    if ("up".equalsIgnoreCase(trend)) {
                        close *= 1.005;
                    } else if ("down".equalsIgnoreCase(trend)) {
                        close *= 0.995;
                    }

                    // Tremendous change at trend start
                    if (i == 0 && j < candlesPerDay * 0.5) {  // First 10% of daily candles
                        double changeFactor = 1 + (0.15 + random.nextDouble() * 0.35);
                        close *= random.nextBoolean() ? changeFactor : 1 / changeFactor;
                    }

                    // Clamp price to reasonable bounds
                    close = Math.max(Math.min(close, initialPrice * 2), initialPrice * 0.5);

                    LocalDateTime candleTime = currentDateTime.plus(i, ChronoUnit.DAYS)
                            .plus(j * minutesPerCandle, ChronoUnit.MINUTES);

                    CandlestickData candle = new CandlestickData(candleTime, open, high, low, close);
                    candles.add(candle);

                    price = close;
                }
            }

            // Increment the current date
            currentDateTime = currentDateTime.plus(duration, ChronoUnit.DAYS);
        }

        return candles;
    }

    /**
     * Splits totalDays into n random parts such that their sum equals totalDays.
     */
    private static List<Integer> splitTotalDays(int totalDays, int parts) {
        List<Integer> durations = new ArrayList<>();
        Random random = new Random();

        int remainingDays = totalDays;
        for (int i = 0; i < parts - 1; i++) {
            int duration = random.nextInt(remainingDays / (parts - i)) + 1;
            durations.add(duration);
            remainingDays -= duration;
        }
        durations.add(remainingDays);

        return durations;
    }
    public List<CandlestickData> addCompany(CompanyDTO companyDTO, int gameId, List<String> trends) {
        Game game = gameRepository.findById(gameId);

        // Save company in the database
        Company company = new Company();
        company.setName(companyDTO.getName());
        //company.setIndustry(companyDTO.getIndustry());
        //company.setInitialPrice(companyDTO.getInitialPrice());
        company.setGame(game);
        //companyRepository.save(company);

        // Generate candlestick data
        return generateCandlestickData(
                companyDTO.getInitialPrice(),
                companyDTO.getVolatility(),
                companyDTO.getDrift(),
                trends,
                game.getSimulationDays(),
                game.getCandlesPerDay(),
                game.getVirtualStartDate()
        );
    }
    public Company saveCompany(CompanyDTO companyDTO, int gameId) throws IOException {
        System.out.println(companyDTO.getNews());

        // Map CompanyDTO to Company entity
        Company company = new Company();
        company.setName(companyDTO.getName());
        company.setSector(companyDTO.getIndustry());
        company.setMarketCap(0); // Or some default value
        company.setPeRatio(0);   // Adjust as needed
        company.setDebtToEquity(0);
        company.setEps(0);
        company.setDividendYield(0);
        company.setGame(new Game(gameId));
        if (companyDTO.getNews() != null) {
            System.out.println("news are not empty");

            company.setNews(companyDTO.getNews());
        }
        // Save CandlestickData to Excel
        String excelFilePath = saveCandlestickDataToExcel(companyDTO.getCandlestickData(), companyDTO.getName());
        company.setStockFilePath(excelFilePath);

        // Save the company to generate an ID


        return companyRepository.save(company);
    }

    private String saveCandlestickDataToExcel(List<CandlestickData> candlestickData, String companyName) throws IOException {
        if (candlestickData == null || candlestickData.isEmpty()) {
            throw new IllegalArgumentException("Candlestick data is empty");
        }

        // Define the Excel file name
        String fileName = companyName.replaceAll("\\s+", "_") + "_candlestick_data";
        String filePath = "C:/xampp/htdocs/data/" + fileName; // Adjust the directory as needed
        filePath= generateUniqueFileName(filePath,".xlsx");
        // Create the directory if it doesn't exist
        File directory = new File("C:/xampp/htdocs/data");
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Create Excel workbook and sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Candlestick Data");

        // Add headers
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Date");
        headerRow.createCell(1).setCellValue("Open");
        headerRow.createCell(2).setCellValue("High");
        headerRow.createCell(3).setCellValue("Low");
        headerRow.createCell(4).setCellValue("Close");

        // Add data rows
        int rowNum = 1;
        for (CandlestickData data : candlestickData) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(data.getDateTime().toString());
            row.createCell(1).setCellValue(data.getOpen());
            row.createCell(2).setCellValue(data.getHigh());
            row.createCell(3).setCellValue(data.getLow());
            row.createCell(4).setCellValue(data.getClose());
        }

        // Write to file
        try (FileOutputStream fileOut = new FileOutputStream(filePath)) {
            workbook.write(fileOut);
        } finally {
            workbook.close();
        }

        return filePath;
    }
    private String generateUniqueFileName(String prefix, String extension) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        String formattedDateTime = now.format(formatter);
        return prefix + "_" + formattedDateTime + extension;
    }
   /* public List<CandlestickData> getData(int id) throws Exception {
        Company company=companyRepository.findById(id).orElse(null);
        // Fetch the game details
        Game game = null;
        if (company != null) {
            game = company.getGame();
        }

        // Calculate elapsed real time
        LocalDateTime currentTime = LocalDateTime.now();
        Duration elapsedRealTime = Duration.between(game.getStartDate(), currentTime);

        // Calculate elapsed virtual time
        long totalRealDays = Duration.between(game.getStartDate(), game.getEndDate()).toDays();
        double virtualDaysPerRealDay = (double) game.getSimulationDays() / totalRealDays;
        double elapsedVirtualDays = elapsedRealTime.toDays() + elapsedRealTime.toHoursPart() / 24.0;
        elapsedVirtualDays *= virtualDaysPerRealDay;
        // Determine current virtual time
        LocalDateTime currentVirtualTime = game.getVirtualStartDate().plusDays((long) elapsedVirtualDays);

        // Calculate candlestick intervals
        double candlestickIntervalHours = 24.0 / game.getCandlesPerDay();
        double elapsedTime=  candlestickIntervalHours * (totalRealDays / (double) game.getSimulationDays()) * 60;;

        // Read Excel file data
        assert company != null;
        String excelFilePath = company.getStockFilePath();
        System.out.println("kolou tamem");
        List<CandlestickData> allData = readExcelData(excelFilePath);

        // Filter relevant data
        List<CandlestickData> filteredData = new ArrayList<>();
        LocalDateTime virtualTimeCursor = game.getVirtualStartDate();
        System.out.println("totalRealDays: " + totalRealDays);
        System.out.println("game.getSimulationDays(): " + game.getSimulationDays());
        System.out.println("Initial virtualTimeCursor: " + virtualTimeCursor);
        System.out.println("Initial currentVirtualTime: " + currentVirtualTime);
        System.out.println("candlestickIntervalHours: " + candlestickIntervalHours);
        System.out.println("Real time between candlestick intervals: " + elapsedTime + " minutes");
        while (virtualTimeCursor.isBefore(currentVirtualTime)) {

            // Calculate the end of the current interval
            LocalDateTime intervalEnd = virtualTimeCursor.plusSeconds((long) (candlestickIntervalHours*3600));
            //System.out.println("intervalEnd: " +intervalEnd) ;
            // Validate that the intervalEnd progresses
            if (!intervalEnd.isAfter(virtualTimeCursor)) {
                throw new IllegalStateException("Interval size is too small; virtualTimeCursor will not progress.");
            }

            // Filter rows within the current interval
            LocalDateTime finalVirtualTimeCursor = virtualTimeCursor;
            List<CandlestickData> intervalData = allData.stream()
                    .filter(data -> !data.getDateTime().isBefore(finalVirtualTimeCursor) && data.getDateTime().isBefore(intervalEnd))
                    .toList();

            // Aggregate data for the interval
            if (!intervalData.isEmpty()) {
                double open = intervalData.get(0).getOpen();
                double close = intervalData.get(intervalData.size() - 1).getClose();
                double high = intervalData.stream().mapToDouble(CandlestickData::getHigh).max().orElse(0);
                double low = intervalData.stream().mapToDouble(CandlestickData::getLow).min().orElse(0);

                filteredData.add(new CandlestickData(virtualTimeCursor, open, high, low, close));
            }

            // Move to the next interval
            virtualTimeCursor = intervalEnd;
        }

       // System.out.println(filteredData);

        return filteredData;
    }*/
    public DateData getlastdata(int id) throws Exception {
        List<CandlestickData> lcs=this.getData(id);
        int size = lcs.size();
        return new DateData(lcs.get(size - 1).getDateTime(),List.of(lcs.get(size - 1).getClose(), lcs.get(size - 2).getClose()));
    }
    public double getCurrentPrice(int id) throws Exception {
        List<CandlestickData> lcs=this.getData(id);
        int size = lcs.size();
        return lcs.get(size - 1).getClose();
    }
   public List<CandlestickData> getData(int id) throws Exception {
       // Fetch the company and its associated game
       Company company = companyRepository.findById(id).orElse(null);
       if (company == null || company.getGame() == null) {
           throw new Exception("Invalid company or game data");
       }
       Game game = company.getGame();

       // Calculate elapsed real time as a Duration
       LocalDateTime currentTime = LocalDateTime.now();
       Duration elapsedRealTime = Duration.between(game.getStartDate(), currentTime);

       // Calculate virtual seconds per real second
       long totalRealSeconds = Duration.between(game.getStartDate(), game.getEndDate()).toSeconds();
       double virtualSecondsPerRealSecond = ((double) game.getSimulationDays() * 24 * 60 * 60) / totalRealSeconds;

       // Calculate elapsed virtual time as a Duration
       long elapsedVirtualSeconds = (long) (elapsedRealTime.toSeconds() * virtualSecondsPerRealSecond);
       Duration elapsedVirtualTime = Duration.ofSeconds(elapsedVirtualSeconds);

       // Determine the current virtual time
       LocalDateTime currentVirtualTime = game.getVirtualStartDate().plus(elapsedVirtualTime);

       // Calculate candlestick interval in seconds
       double candlestickIntervalSeconds = (24.0 / game.getCandlesPerDay()) * 3600;

       // Read Excel file data
       String excelFilePath = company.getStockFilePath();
       List<CandlestickData> allData = excelDataService.readExcelData(excelFilePath);//readExcelData(excelFilePath);

       // Filter relevant data
       List<CandlestickData> filteredData = new ArrayList<>();
       LocalDateTime virtualTimeCursor = game.getVirtualStartDate();

       while (virtualTimeCursor.isBefore(currentVirtualTime)) {
           // Calculate the end of the current candlestick interval
           LocalDateTime intervalEnd = virtualTimeCursor.plusSeconds((long) candlestickIntervalSeconds);

           // Filter rows within the current interval
           LocalDateTime finalVirtualTimeCursor = virtualTimeCursor;
           List<CandlestickData> intervalData = allData.stream()
                   .filter(data -> !data.getDateTime().isBefore(finalVirtualTimeCursor) && data.getDateTime().isBefore(intervalEnd))
                   .toList();

           // Aggregate data for the interval
           if (!intervalData.isEmpty()) {
               double open = intervalData.get(0).getOpen();
               double close = intervalData.get(intervalData.size() - 1).getClose();
               double high = intervalData.stream().mapToDouble(CandlestickData::getHigh).max().orElse(0);
               double low = intervalData.stream().mapToDouble(CandlestickData::getLow).min().orElse(0);

               filteredData.add(new CandlestickData(virtualTimeCursor, open, high, low, close));
           }

           // Move to the next interval
           virtualTimeCursor = intervalEnd;
       }

       return filteredData;
   }
    private List<CandlestickData> readExcelData(String filePath) throws IOException {
        List<CandlestickData> data = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(new File(filePath))) {
            Sheet sheet = workbook.getSheet("Candlestick Data"); // Assume companyId maps to the sheet index
            System.out.println("kolou tamem sheet");
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
        System.out.println("kolou tamem after");
        return data;
    }
    public Company getbyid(int id){
        return companyRepository.findById(id).orElse(null);
    }
}
