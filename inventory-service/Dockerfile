FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy dependency manifests first so this layer is cached when only source changes
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cached unless pom.xml changes)
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline -DskipTests || true

# Copy source and build
COPY src src
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]

