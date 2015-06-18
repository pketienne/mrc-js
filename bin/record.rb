class Record
  attr_accessor :poeta, :fabula, :fpid, :line_number_first_ordinate, :line_number_first_label,
                :line_number_last_ordinate, :line_number_last_label, :numlines, :nomen,
                :genus_personae, :line_first, :line_last, :meter_before, :meter_after, :closure,
                :comments_on_length, :comments_other, :meter, :metertype

  def initialize(record)
    @poeta = ""
    @fabula = ""
    @fpid = ""
    @line_number_first_ordinate = ""
    @line_number_first_label = ""
    @line_number_last_ordinate = ""
    @line_number_last_label = ""
    @numlines = ""
    @nomen = ""
    @genus_personae = ""
    @line_first = ""
    @line_last = ""
    @meter_before = ""
    @meter_after = ""
    @closure = ""
    @comments_on_length = ""
    @comments_other = ""
    @meter = ""
    @metertype = ""
    populate(record.chomp)
  end

  def populate(record)
    fields = record.split("\t")
    fields.each_with_index { | val, index |
      case index
      when 0
        @poeta = val
      when 1
        @fabula = val
      when 2
        @fpid = val
      when 3
        @line_number_first_ordinate = val
      when 4
        @line_number_first_label = val
      when 5
        @line_number_last_ordinate = val
      when 6
        @line_number_last_label = val
      when 7
        @numlines = val
      when 8
        @nomen = val
      when 9
        @genus_personae = val
      when 10
        @line_first = val
      when 11
        @line_last = val
      when 12
        @meter_before = val
      when 13
        @meter_after = val
      when 14
        @closure = val
      when 15
        @comments_on_length = val
      when 16
        @comments_other = val
      when 17
        @meter = val
      when 18
        @metertype = val
      end
    }
  end
  
end
