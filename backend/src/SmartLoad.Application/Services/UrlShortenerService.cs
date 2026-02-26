using System;
using System.Security.Cryptography;
using System.Text;

namespace SmartLoad.Application.Services
{
    public class UrlShortenerService
    {
        private const string Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        private const int ShortUrlLength = 5;

        public string GenerateUrl()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[ShortUrlLength];
            rng.GetBytes(bytes);

            var result = new StringBuilder(ShortUrlLength);
            foreach (var b in bytes)
            {
                result.Append(Alphabet[b % Alphabet.Length]);
            }

            return result.ToString();
        }

        public string GenerateUrlFromGuid(Guid guid)
        {
            // Create a hash of the GUID to get consistent but short URL
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(guid.ToByteArray());

            var result = new StringBuilder(ShortUrlLength);
            for (int i = 0; i < ShortUrlLength; i++)
            {
                result.Append(Alphabet[hashBytes[i] % Alphabet.Length]);
            }

            return result.ToString();
        }
    }
}