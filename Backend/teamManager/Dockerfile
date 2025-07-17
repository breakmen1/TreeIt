# Use a Maven image to build the app
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy source code and build
COPY . .
RUN mvn clean package -DskipTests

# Use a smaller runtime image
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app

# Copy the built jar from the previous stage
COPY --from=build/target/demo-0.0.1-SNAPSHOT.jar demo.jar

# Expose the app port
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "demo.jar"]