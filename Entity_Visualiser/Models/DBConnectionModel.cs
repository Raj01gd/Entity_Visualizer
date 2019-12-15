
using System.ComponentModel.DataAnnotations;

namespace Entity_Visualiser.Models
{
    public class DBConnectionModel
    {
        public string ServerName { get; set; }
        public string DataBaseName { get; set; }
        public string IsSecure { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        
    }
}