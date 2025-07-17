# Stage 1: Build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY --from=build /app/target/teamManager-0.0.1-SNAPSHOT.jar teamManager.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "teamManager.jar"]