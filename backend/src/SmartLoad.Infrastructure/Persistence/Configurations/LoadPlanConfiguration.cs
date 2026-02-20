using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLoad.Domain.Entities;
using System.Text.Json;

namespace SmartLoad.Infrastructure.Persistence.Configurations
{
    public class LoadPlanConfiguration : IEntityTypeConfiguration<LoadPlan>
    {
        public void Configure(EntityTypeBuilder<LoadPlan> builder)
        {
            builder.ToTable("LoadPlans");
            builder.HasKey(x => x.Id);

            // Store the Vehicle as an owned entity (flattens into the same table)
            builder.OwnsOne(x => x.Vehicle, v =>
            {
                v.Property(p => p.Name).HasColumnName("VehicleName");
                v.OwnsOne(p => p.InnerDimensions);
            });

            // Store PackedItems as a JSONB column (PostgreSQL specific/flexible)
            builder.Property(x => x.PackedItems)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonSerializerOptions.Default),
                    v => JsonSerializer.Deserialize<List<SmartLoad.Domain.ValueObjects.PackedItem>>(v, JsonSerializerOptions.Default) ?? new()
                )
                .HasColumnType("jsonb");

            // Store UnpackedItems as a JSONB column
            builder.Property(x => x.UnpackedItems)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonSerializerOptions.Default),
                    v => JsonSerializer.Deserialize<List<SmartLoad.Domain.Entities.Box>>(v, JsonSerializerOptions.Default) ?? new()
                )
                .HasColumnType("jsonb");
        }
    }
}
