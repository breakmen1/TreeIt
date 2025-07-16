# Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN mvn -B dependency:go-offline

COPY src src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/teamManager-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]